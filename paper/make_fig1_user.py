"""Fig. 1 - the authors' system-architecture diagram (Mermaid source supplied in
SANAD_ISDIA_2027_Reviewed.docx), redrawn as a monochrome LNCS figure.

Same four numbered groups, nodes, flows, legend and notes as the authors' diagram;
the Mermaid render itself was 1055 px wide (~220 dpi at column width), on a black
background, with unrendered icon codes (fa:fa-...), so it is redrawn here.
Rendered at S=3 (36 px/mm, ~915 dpi at 12.2 cm print width)."""
import math
from PIL import Image, ImageDraw, ImageFont

S = 3
W0, H0 = 1464, 640
img = Image.new("RGB", (W0 * S, H0 * S), "white")
dr = ImageDraw.Draw(img)
INK = (25, 25, 25)
GREY = (95, 95, 95)
GROUP_FILL = (244, 244, 244)


def font(sz, bold=False):
    for n in (["segoeuib.ttf", "arialbd.ttf"] if bold else ["segoeui.ttf", "arial.ttf"]):
        try:
            return ImageFont.truetype("C:/Windows/Fonts/" + n, int(sz * S))
        except Exception:
            pass
    return ImageFont.load_default()


FN, FG, FL, FNOTE = font(19), font(19, True), font(15), font(16.5)
P = lambda *v: [x * S for x in v]


def dashed_line(x1, y1, x2, y2, dash=7, gap=6, width=2, fill=INK):
    L = math.hypot(x2 - x1, y2 - y1)
    if L == 0:
        return
    ux, uy = (x2 - x1) / L, (y2 - y1) / L
    t = 0
    while t < L:
        e = min(t + dash, L)
        dr.line(P(x1 + ux * t, y1 + uy * t, x1 + ux * e, y1 + uy * e), fill=fill, width=width * S)
        t += dash + gap


def head(x1, y1, x2, y2):
    ang = math.atan2(y2 - y1, x2 - x1)
    L, a = 13, 0.42
    dr.polygon([tuple(P(x2, y2)),
                tuple(P(x2 - L * math.cos(ang - a), y2 - L * math.sin(ang - a))),
                tuple(P(x2 - L * math.cos(ang + a), y2 - L * math.sin(ang + a)))], fill=INK)


def path(pts, dotted=False, both=False, arrow=True):
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        if dotted:
            dashed_line(x1, y1, x2, y2, dash=4, gap=5)
        else:
            dr.line(P(x1, y1, x2, y2), fill=INK, width=2 * S)
    if arrow:
        head(*pts[-2], *pts[-1])
    if both:
        head(*pts[1], *pts[0])


def text_block(cx, cy, lines, f=FN, lh=22):
    y0 = cy - (len(lines) - 1) * lh / 2
    for i, ln in enumerate(lines):
        bb = dr.textbbox((0, 0), ln, font=f)
        assert (bb[2] - bb[0]) / S < 999
        dr.text(tuple(P(cx, y0 + i * lh)), ln, font=f, fill=INK, anchor="mm")


def node(x, y, w, h, lines, dashed=False):
    if dashed:
        dr.rounded_rectangle(P(x, y, x + w, y + h), radius=8 * S, fill="white")
        for (a, b, c, e) in [(x, y, x + w, y), (x + w, y, x + w, y + h),
                             (x + w, y + h, x, y + h), (x, y + h, x, y)]:
            dashed_line(a, b, c, e, dash=8, gap=5, width=2)
    else:
        dr.rounded_rectangle(P(x, y, x + w, y + h), radius=8 * S, outline=INK, width=2 * S, fill="white")
    for ln in lines:  # overflow guard
        bb = dr.textbbox((0, 0), ln, font=FN)
        assert (bb[2] - bb[0]) / S <= w - 10, (ln, (bb[2] - bb[0]) / S, w)
    text_block(x + w / 2, y + h / 2, lines, lh=20 if len(lines) > 2 else 22)
    return dict(l=x, r=x + w, t=y, b=y + h, cx=x + w / 2, cy=y + h / 2)


def cylinder(x, y, w, h, lines):
    e = 14
    dr.rectangle(P(x, y + e / 2, x + w, y + h - e / 2), fill="white")
    dr.ellipse(P(x, y + h - e, x + w, y + h), outline=INK, width=2 * S, fill="white")
    dr.rectangle(P(x + 1, y + e / 2, x + w - 1, y + h - e / 2), fill="white")
    dr.line(P(x, y + e / 2, x, y + h - e / 2), fill=INK, width=2 * S)
    dr.line(P(x + w, y + e / 2, x + w, y + h - e / 2), fill=INK, width=2 * S)
    dr.ellipse(P(x, y, x + w, y + e), outline=INK, width=2 * S, fill="white")
    text_block(x + w / 2, y + h / 2 + 5, lines)
    return dict(l=x, r=x + w, t=y, b=y + h, cx=x + w / 2, cy=y + h / 2)


def group(x, y, w, h, title):
    dr.rectangle(P(x, y, x + w, y + h), outline=GREY, width=2 * S, fill=GROUP_FILL)
    dr.text(tuple(P(x + w / 2, y + 16)), title, font=FG, fill=INK, anchor="mm")


def label(x, y, s, anchor="mm", f=FL):
    bb = dr.textbbox(tuple(P(x, y)), s, font=f, anchor=anchor)
    pad = 3 * S
    dr.rectangle((bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad), fill="white")
    dr.text(tuple(P(x, y)), s, font=f, fill=INK, anchor=anchor)


NH = 68            # node height
GT, GB = 46, 512   # top/bottom of the left-hand groups

# ---------------- groups ----------------
group(8, GT, 252, GB - GT, "1. User Interface & Input")
group(280, GT, 312, GB - GT, "2. Application Backend")
group(612, GT, 632, 224, "3. AI Processing & Gov.-Service Navigation")
group(612, 288, 844, 224, "4. Storage, Credential Issuance & Evaluation")

# ---------------- 1. UI ----------------
worker = node(28, 86, 140, 50, ["Worker"])
ui = node(28, 178, 212, 82, ["Web / Mobile UI", "text · voice ·", "documents"])
val = node(28, 300, 212, NH, ["Input", "Validation"])
err = node(28, 412, 212, NH, ["Error", "Handling"])
path([(worker["cx"], worker["b"]), (worker["cx"], ui["t"])])
path([(134, ui["b"]), (134, val["t"])])
path([(134, val["b"]), (134, err["t"])])

# ---------------- 2. Backend ----------------
api = node(300, 86, 272, 50, ["SANAD Backend API"])
auth = node(300, 190, 142, NH, ["Authentication", "& Session"])
pg1 = cylinder(458, 182, 114, 80, ["PostgreSQL", "(RLS)"])
orch = node(300, 314, 142, NH, ["Request", "Orchestrator"])
docs = node(458, 314, 114, NH, ["Uploaded", "Documents"])
path([(auth["cx"], api["b"]), (auth["cx"], auth["t"])])
path([(auth["cx"], auth["b"]), (auth["cx"], orch["t"])])
path([(pg1["cx"], api["b"]), (pg1["cx"], pg1["t"])], dotted=True, both=True)
path([(orch["r"], orch["cy"]), (docs["l"], docs["cy"])])
path([(docs["cx"], docs["t"]), (docs["cx"], pg1["b"])], dotted=True, both=True)
# input validation -> backend API
path([(val["r"], val["cy"]), (270, val["cy"]), (270, 124), (api["l"], 124)])

# ---------------- 3. AI processing ----------------
r1, r2 = 88, 180
pa = node(632, r1, 190, NH, ["Prompt", "Assembly"])
llm = node(842, r1, 190, NH, ["AI Processing", "(LLM)"])
gem = node(1052, r1, 176, NH, ["Gemini", "external AI service"], dashed=True)
cat = node(632, r2, 190, NH, ["Curated UAE", "information", "catalogue"])
guard = node(842, r2, 190, NH, ["Output", "Guardrails"])
res = node(1052, r2, 176, NH, ["Structured", "Results"])
path([(api["r"], 108), (pa["l"], 108)])
path([(cat["cx"], cat["t"]), (cat["cx"], pa["b"])])
path([(pa["r"], pa["cy"]), (llm["l"], llm["cy"])])
path([(llm["r"], llm["cy"]), (gem["l"], gem["cy"])], both=True)
path([(llm["cx"], llm["b"]), (llm["cx"], guard["t"])])
path([(guard["r"], guard["cy"]), (res["l"], res["cy"])])

# return to the user: guidance (from AI) and results + next steps (from backend)
LANE_Y, DROP_X = 24, 204
path([(res["r"], res["cy"]), (1236, res["cy"]), (1236, LANE_Y), (DROP_X, LANE_Y), (DROP_X, ui["t"])])
path([(api["l"], 100), (DROP_X, 100)], arrow=False)
label(725, LANE_Y, "guidance to user")
label(238, 89, "results + next steps", f=font(13))

# ---------------- legend (top right) ----------------
LX, LY = 1256, 46
dr.rectangle(P(LX, LY, 1456, LY + 224), outline=GREY, width=2 * S, fill="white")
dr.text(tuple(P(LX + 100, LY + 16)), "Legend", font=FG, fill=INK, anchor="mm")
yy = LY + 52
path([(LX + 12, yy), (LX + 52, yy)])
dr.text(tuple(P(LX + 60, yy)), "runtime flow", font=FL, fill=INK, anchor="lm")
yy += 38
path([(LX + 12, yy), (LX + 52, yy)], dotted=True)
dr.text(tuple(P(LX + 60, yy)), "non-runtime flow", font=FL, fill=INK, anchor="lm")
yy += 38
for (a, b, c, e) in [(LX + 12, yy - 11, LX + 52, yy - 11), (LX + 52, yy - 11, LX + 52, yy + 11),
                     (LX + 52, yy + 11, LX + 12, yy + 11), (LX + 12, yy + 11, LX + 12, yy - 11)]:
    dashed_line(a, b, c, e, dash=5, gap=4, width=2)
dr.text(tuple(P(LX + 60, yy)), "external boundary", font=FL, fill=INK, anchor="lm")
yy += 44
cylinder(LX + 14, yy - 18, 36, 36, [""])
dr.text(tuple(P(LX + 60, yy)), "data storage", font=FL, fill=INK, anchor="lm")

# ---------------- 4. storage / credential ----------------
s1, s2 = 330, 426
prep = node(632, s1, 160, NH, ["Claim", "Preparation"])
snap = node(812, s1, 190, NH, ["Claim snapshot", "+ salt", "(off-chain)"])
sha = node(1022, s1, 170, NH, ["SHA-256", "Commitment"])
con = node(1212, s1, 228, NH, ["Issuer Contract", "(Polygon Amoy testnet)"], dashed=True)
pg2 = cylinder(812, s2 - 8, 190, 78, ["PostgreSQL (RLS)", "stored off-chain"])
ver = node(1212, s2, 228, NH, ["Verification"])
evl = node(1022, s2, 170, NH, ["Offline Evaluation", "(test cases)"])
# orchestrator -> claim preparation
path([(orch["cx"], orch["b"]), (orch["cx"], 452), (602, 452), (602, prep["cy"]), (prep["l"], prep["cy"])])
path([(prep["r"], prep["cy"]), (snap["l"], snap["cy"])])
path([(snap["r"], snap["cy"]), (sha["l"], sha["cy"])])
path([(sha["r"], sha["cy"]), (con["l"], con["cy"])])
path([(snap["cx"], snap["b"]), (snap["cx"], pg2["t"])])
path([(prep["cx"], prep["b"]), (prep["cx"], pg2["cy"] + 4), (pg2["l"], pg2["cy"] + 4)], dotted=True)
path([(con["cx"], con["b"]), (con["cx"], ver["t"])])
path([(ver["l"], ver["cy"]), (evl["r"], evl["cy"])], dotted=True)

# group-1 title redrawn over the return lane so the line passes behind it
bb = dr.textbbox(tuple(P(8 + 126, GT + 16)), "1. User Interface & Input", font=FG, anchor="mm")
dr.rectangle((bb[0] - 4 * S, bb[1] - 3 * S, bb[2] + 4 * S, bb[3] + 3 * S), fill=GROUP_FILL)
dr.text(tuple(P(8 + 126, GT + 16)), "1. User Interface & Input", font=FG, fill=INK, anchor="mm")

# ---------------- notes strip ----------------
NY = 528
dr.rectangle(P(8, NY, 1456, H0 - 8), outline=GREY, width=2 * S, fill="white")
notes = [
    "Notes.  External AI processing is outside database RLS protection.  Zero-PII applies to the public artefact "
    "scope, not the entire system.",
    "Public metadata may permit activity correlation.  Polygon Amoy is a testnet, not a production deployment.  "
    "No government endorsement implied.",
]
for i, ln in enumerate(notes):
    bb = dr.textbbox((0, 0), ln, font=FNOTE)
    assert (bb[2] - bb[0]) / S < 1420, (ln, (bb[2] - bb[0]) / S)
    dr.text(tuple(P(22, NY + 30 + i * 32)), ln, font=FNOTE, fill=INK, anchor="lm")

img.save("paper/fig1_architecture_user.png", dpi=(915, 915))
print("saved paper/fig1_architecture_user.png", img.size)
