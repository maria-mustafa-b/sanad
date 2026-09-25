import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import {
  adminDb,
  demoMode,
  demoRoot,
  insert,
  remove,
  list,
  update,
} from "@/lib/database/repository";
import { AppError, assert } from "@/lib/api/errors";
import type { Actor, Row } from "@/lib/domain/types";
const supported = ["application/pdf", "image/png", "image/jpeg", "text/plain"];
function validMagic(bytes: Buffer, mime: string) {
  return mime === "application/pdf"
    ? bytes.subarray(0, 5).toString() === "%PDF-"
    : mime === "image/png"
      ? bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a"
      : mime === "image/jpeg"
        ? bytes.subarray(0, 3).toString("hex") === "ffd8ff"
        : !bytes.includes(0);
}
async function save(key: string, bytes: Buffer, mime: string) {
  if (demoMode()) {
    const directory = path.join(demoRoot(), "files");
    await mkdir(directory, { recursive: true, mode: 0o700 });
    await writeFile(path.join(directory, path.basename(key)), bytes, {
      mode: 0o600,
    });
  } else {
    const { error } = await adminDb()
      .storage.from("sanad-documents")
      .upload(key, bytes, { contentType: mime, upsert: false });
    if (error)
      throw new AppError(
        "STORAGE_ERROR",
        "Could not securely store the document.",
        503,
      );
  }
}
async function read(key: string): Promise<Buffer> {
  if (demoMode())
    return readFile(path.join(demoRoot(), "files", path.basename(key)));
  const { data, error } = await adminDb()
    .storage.from("sanad-documents")
    .download(key);
  if (error || !data)
    throw new AppError("STORAGE_ERROR", "Could not read the document.", 503);
  return Buffer.from(await data.arrayBuffer());
}
async function erase(key: string) {
  if (demoMode()) {
    await unlink(path.join(demoRoot(), "files", path.basename(key)));
  } else {
    const { error } = await adminDb()
      .storage.from("sanad-documents")
      .remove([key]);
    if (error)
      throw new AppError(
        "STORAGE_ERROR",
        "Could not delete the document.",
        503,
      );
  }
}
export async function uploadDocument(request: Request, user: Actor) {
  const form = await request.formData();
  const file = form.get("file");
  assert(file instanceof File, "INVALID_FILE", "Choose a supported file.");
  assert(
    file.size > 0 && file.size <= 10485760,
    "INVALID_FILE",
    "Files must be at most 10 MB.",
  );
  assert(
    supported.includes(file.type),
    "INVALID_FILE",
    "Choose a PDF, PNG, JPEG or plain text file.",
  );
  const bytes = Buffer.from(await file.arrayBuffer());
  assert(
    validMagic(bytes, file.type),
    "INVALID_FILE",
    "The file content does not match its declared type.",
  );
  const id = randomUUID(),
    key = `${user.id}/${id}`;
  await save(key, bytes, file.type);
  try {
    return await insert("documents", {
      id,
      user_id: user.id,
      storage_path: key,
      original_name: file.name.slice(0, 180),
      mime_type: file.type,
      size_bytes: file.size,
      analysis_status: "PENDING",
    });
  } catch (error) {
    await erase(key);
    throw error;
  }
}
export async function downloadDocument(doc: Row, user: Actor) {
  assert(doc.user_id === user.id, "NOT_FOUND", "Document not found.", 404);
  const bytes = await read(doc.storage_path);
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": doc.mime_type,
      "Content-Disposition": `attachment; filename="document.${doc.mime_type === "application/pdf" ? "pdf" : doc.mime_type === "image/png" ? "png" : doc.mime_type === "image/jpeg" ? "jpg" : "txt"}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export async function deleteDocument(doc: Row, user: Actor) {
  assert(doc.user_id === user.id, "NOT_FOUND", "Document not found.", 404);
  const attached = await list("application_documents", {
    document_id: doc.id,
    user_id: user.id,
  });
  assert(
    attached.length === 0,
    "DOCUMENT_IN_USE",
    "Remove this document from its application before deleting it.",
    409,
  );
  await erase(doc.storage_path);
  await remove("documents", doc.id, user.id);
}
async function extractText(doc: Row, bytes: Buffer) {
  if (doc.mime_type === "text/plain")
    return bytes.toString("utf8").slice(0, 15000);
  if (doc.mime_type === "application/pdf") {
    // @ts-ignore
    const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const pdf = await getDocument({
      data: new Uint8Array(bytes),
      useSystemFonts: true,
      disableFontFace: true,
    }).promise;
    let text = "";
    for (let page = 1; page <= Math.min(pdf.numPages, 8); page++) {
      const p = await pdf.getPage(page);
      const items = await p.getTextContent();
      text +=
        items.items.map((item: any) => ("str" in item ? item.str : "")).join(" ") +
        "\n";
    }
    return text.slice(0, 15000);
  }
  throw new AppError(
    "OCR_REQUIRED",
    "Image extraction needs an OCR provider; upload a text-based PDF or plain text file.",
    422,
  );
}
export async function analyzeDocument(doc: Row, user: Actor) {
  const bytes = await read(doc.storage_path);
  const text = doc.mime_type.startsWith("image/")
    ? undefined
    : await extractText(doc, bytes);
  if (text !== undefined)
    assert(
      text.trim().length > 0,
      "EMPTY_DOCUMENT",
      "No readable text found; scanned PDFs need OCR.",
      422,
    );
  let extracted: {
    document_type: string;
    date: string | null;
    employer_name: string | null;
    salary_period: string | null;
  };
  if (!process.env.AI_API_KEY) {
    if (!user.demo)
      throw new AppError(
        "AI_NOT_CONFIGURED",
        "Configure an AI provider for document analysis.",
        503,
      );
    if (text === undefined)
      throw new AppError(
        "OCR_REQUIRED",
        "Image extraction requires a configured AI provider.",
        422,
      );
    const period =
      /(january|february|march|april|may|june|july|august|september|october|november)/i.exec(
        text,
      )?.[0] || null;
    extracted = {
      document_type: /salary|payslip/i.test(text)
        ? "salary document"
        : /contract/i.test(text)
          ? "employment contract"
          : "unknown",
      date: null,
      employer_name: null,
      salary_period: period,
    };
  } else {
    const { extractDocument } = await import("@/lib/ai/document");
    extracted = await extractDocument({
      text,
      image:
        text === undefined
          ? { mime: doc.mime_type, data: bytes.toString("base64") }
          : undefined,
    });
  }
  return update(
    "documents",
    doc.id,
    { extraction: extracted, analysis_status: "NEEDS_CONFIRMATION" },
    user.id,
  );
}
