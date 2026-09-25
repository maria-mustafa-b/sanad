import { list, insert, demoMode, adminDb } from "@/lib/database/repository";
import type { Row } from "@/lib/domain/types";
import { AppError } from "@/lib/api/errors";
export type Service = Row & {
  title: string;
  description: string;
  category: string;
  eligibility_guidance: string;
  official_url?: string;
  supported_situations: string[];
  steps: string[];
  details: { kind: string; last_verified: string; official_url: string };
  published: boolean;
};
export const seedServices = [
  {
    title: "Private-sector labour complaint",
    category: "Labour",
    url: "https://mohre.gov.ae/en/services/register-labor-complaints-private-sector-employees-2022",
    situations: ["unpaid_wages", "job_loss", "labour_dispute"],
    description:
      "A Ministry of Human Resources and Emiratisation complaint route for private-sector employees.",
  },
  {
    title: "Unemployment insurance information",
    category: "Employment support",
    url: "https://u.ae/en/information-and-services/jobs/insurance/unemployment-insurance-scheme",
    situations: ["job_loss", "employment_support"],
    description:
      "Official guidance on the unemployment insurance scheme; conditions and timing should be checked.",
  },
  {
    title: "Payment of wages guidance",
    category: "Labour",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/payment-of-wages",
    situations: ["unpaid_wages"],
    description:
      "Official information about wages in private-sector employment.",
  },
  {
    title: "Resolving labour disputes",
    category: "Labour",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/labour-dispute",
    situations: ["labour_dispute", "unpaid_wages"],
    description: "Official overview of labour disputes and resolution.",
  },
  {
    title: "Worker rights guidance",
    category: "Labour",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/labour-rights",
    situations: ["labour_dispute", "unpaid_wages", "job_loss"],
    description: "Official guidance about private-sector worker rights.",
  },
  {
    title: "Terminating an employment contract",
    category: "Labour",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/job-offers-and-work-permits-and-contracts/terminating-employment-contracts",
    situations: ["job_loss", "termination"],
    description:
      "Official guidance for employment termination and related procedures.",
  },
  {
    title: "End-of-service benefits guidance",
    category: "Labour",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/end-of-service-benefits-for-employees-in-the-private-sector",
    situations: ["job_loss", "termination"],
    description: "Official overview of end-of-service benefits.",
  },
  {
    title: "Work permit cancellation service",
    category: "Work permits",
    url: "https://www.mohre.gov.ae/en/services/cancellation-of-work-permits-and-employment-contracts-2022",
    situations: ["job_loss", "work_permit"],
    description:
      "MOHRE work permit cancellation service, generally initiated by employers.",
  },
  {
    title: "Work permit cancellation with labour court case",
    category: "Work permits",
    url: "https://www.mohre.gov.ae/en/services/cancellation-of-work-permit-for-an-employee-with-a-labour-court-case",
    situations: ["labour_dispute", "work_permit"],
    description:
      "MOHRE service concerning work permit cancellation when a labour court case exists.",
  },
  {
    title: "Free-zone complaint service",
    category: "Labour",
    url: "https://www.mohre.gov.ae/en/services/free-zone-establishments-and-similar-organizations-complaints-2022",
    situations: ["labour_dispute", "unpaid_wages"],
    description:
      "MOHRE information about complaints involving free-zone establishments.",
  },
  {
    title: "Work permits overview",
    category: "Work permits",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/job-offers-and-work-permits-and-contracts/work-permits",
    situations: ["work_permit", "employment_support"],
    description: "Official overview of UAE work permit categories.",
  },
  {
    title: "Employment contract models",
    category: "Labour",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/job-offers-and-work-permits-and-contracts/employment-contracts-duration-and-models-in-the-private-sector",
    situations: ["employment_support", "labour_dispute"],
    description:
      "Official guidance about private-sector contract duration and models.",
  },
  {
    title: "Residence visa provisions",
    category: "Residency",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/general-provisions-for-the-residence-visa",
    situations: ["residency", "job_loss"],
    description:
      "Official overview of residence visa provisions and category-specific grace periods.",
  },
  {
    title: "Visa fees and fines",
    category: "Residency",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/visa-fees",
    situations: ["residency"],
    description: "Official information on visa fees and status-related fines.",
  },
  {
    title: "Emirates ID guide",
    category: "Identity",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/emirates-id",
    situations: ["identity", "residency"],
    description: "Official guidance on the Emirates ID.",
  },
  {
    title: "Family residence visas",
    category: "Residency",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-family-members",
    situations: ["family", "residency"],
    description: "Official overview of family residence visas.",
  },
  {
    title: "Student residence visas",
    category: "Residency",
    url: "https://u.ae/en/information-and-services/visa-and-emirates-id/residence-visas/residence-visa-for-studying-in-the-uae",
    situations: ["study", "residency"],
    description: "Official overview of residence visas for students.",
  },
  {
    title: "Health insurance guidance",
    category: "Health",
    url: "https://u.ae/en/information-and-services/health-and-fitness/getting-a-health-insurance",
    situations: ["health_insurance", "job_loss"],
    description: "Official overview of obtaining health insurance.",
  },
  {
    title: "Social welfare programmes",
    category: "Social support",
    url: "https://u.ae/en/information-and-services/social-affairs/social-welfare/social-welfare-programmes",
    situations: ["social_support", "family"],
    description:
      "Official overview of social welfare programmes; eligibility differs by programme and nationality.",
  },
  {
    title: "People of determination support",
    category: "Social support",
    url: "https://u.ae/en/information-and-services/social-affairs/people-of-determination/protection-support-and-assistance-of-people-of-determination",
    situations: ["disability", "social_support"],
    description:
      "Official information about protection and assistance for people of determination.",
  },
  {
    title: "Maternity leave guidance",
    category: "Employment support",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/types-of-leaves-and-entitlements-in-the-private-sector/maternity-leave",
    situations: ["maternity", "employment_support"],
    description:
      "Official information about maternity leave in private-sector employment.",
  },
  {
    title: "Domestic worker rights and procedures",
    category: "Labour",
    url: "https://u.ae/en/information-and-services/jobs/employment-in-the-private-sector/domestic-helpers",
    situations: ["domestic_work", "labour_dispute"],
    description: "Official overview of the domestic worker framework.",
  },
] as const;
export async function services(): Promise<Service[]> {
  const rows = await list("services", { published: true });
  if (rows.length > 0 || !demoMode()) return rows as Service[];
  // On-disk demo catalog is built once, from reviewed government URLs.
  for (const source of seedServices) {
    const existing = await list("services", { title: source.title });
    if (existing.length) continue;
    await insert("services", {
      title: source.title,
      description: source.description,
      category: source.category,
      eligibility_guidance:
        "Potentially relevant only. Check current official conditions before applying.",
      steps: [
        "Read the official source",
        "Check current requirements",
        "Apply with the authority if applicable",
      ],
      keywords: source.situations,
      supported_situations: source.situations,
      published: true,
      details: {
        kind:
          source.title.toLowerCase().includes("complaint") ||
          source.title.toLowerCase().includes("service")
            ? "service"
            : "official guidance",
        official_url: source.url,
        last_verified: "2026-09-25",
      },
    });
  }
  return (await list("services", { published: true })) as Service[];
}
export function matchServices(all: Service[], facts: Record<string, string>) {
  const normalized = Object.values(facts)
    .join(" ")
    .toLowerCase()
    .replaceAll("lost_job", "job_loss");
  return all
    .map((service) => {
      const hits = service.supported_situations.filter(
        (term) =>
          normalized.includes(term) ||
          normalized.includes(term.replaceAll("_", " ")),
      );
      const score = hits.length ? Math.min(92, 60 + hits.length * 15) : 0;
      return {
        ...service,
        relevance_score: score,
        why: hits.length
          ? `Your confirmed situation includes ${hits.join(" and ").replaceAll("_", " ")}, which relates to this official resource.`
          : "",
      };
    })
    .filter((service) => service.relevance_score > 0)
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 8);
}
export async function manageService(
  id: string | undefined,
  body: Record<string, unknown>,
) {
  const allowed = [
    "title",
    "description",
    "category",
    "eligibility_guidance",
    "steps",
    "keywords",
    "supported_situations",
    "published",
    "details",
  ];
  const values = Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key)),
  );
  if (!id && !values.title)
    throw new AppError("VALIDATION_ERROR", "A title is required.");
  if (demoMode()) {
    const { update } = await import("@/lib/database/repository");
    return id ? update("services", id, values) : insert("services", values);
  }
  const db = adminDb(),
    query = id
      ? db.from("services").update(values).eq("id", id)
      : db.from("services").insert(values);
  const { data, error } = await query.select().single();
  if (error)
    throw new AppError("DATABASE_ERROR", "Could not save the service.", 503);
  return data;
}
