"""Fig. 1 - SANAD architecture as a clean monochrome line figure (LNCS-safe).
Rendered at S=3 (36 px/mm, ~915 dpi at 12.2 cm print width)."""
import math
from PIL import Image, ImageDraw, ImageFont

S = 3   # 36 px/mm -> ~915 dpi at 12.2 cm print width (ISDIA editorial policy: figures 800 dpi)
W0, H0 = 1464, 660   # logical design size at 12 px/mm
W, H = W0 * S, H0 * S
img = Image.new("RGB", (W, H), "white")


def font(sz, bold=False):
    names = ["segoeui-bold.ttf" if bold else "segoeui.ttf",
             "arialbd.ttf" if bold else "arial.ttf", "calibrib.ttf" if bold else "calibri.ttf"]
    for n in names:
        try: return ImageFont.truetype("C:/Windows/Fonts/" + n, sz * S)
        except Exception: pass
    return ImageFont.load_default()


class SD:
    """Scale positional coordinates by S; scale the line `width` kwarg; pass the rest."""
    def __init__(self, dr): self.dr = dr
    def _p(self, a):
        if isinstance(a, (int, float)): return a * S
        if isinstance(a, (tuple, list)): return type(a)(self._p(x) for x in a)
        return a
    def __getattr__(self, name):
        attr = getattr(self.dr, name)
        def call(*args, **kw):
            kw = {k: (self._p(v) if k == "width" else v) for k, v in kw.items()}
            return attr(*[self._p(a) for a in args], **kw)
        return call


d = SD(ImageDraw.Draw(img))
FT, FS, FL = font(28, True), font(22), font(20, True)
INK = (25, 25, 25)

def box(x, y, w, h, title, lines, fill=(248, 248, 248)):
    d.rectangle([x, y, x+w, y+h], outline=INK, width=3, fill=fill)
    d.text((x+w/2, y+12), title, font=FT, fill=INK, anchor="ma")
    for i, ln in enumerate(lines):
        d.text((x+w/2, y+56+i*30), ln, font=FS, fill=INK, anchor="ma")

def arrow(x1, y1, x2, y2, label=None):
    d.line([x1, y1, x2, y2], fill=INK, width=3)
    ang = math.atan2(y2-y1, x2-x1); L, a = 16, 0.42
    d.polygon([(x2, y2),
               (x2-L*math.cos(ang-a), y2-L*math.sin(ang-a)),
               (x2-L*math.cos(ang+a), y2-L*math.sin(ang+a))], fill=INK)
    if label:
        d.text(((x1+x2)/2+8, (y1+y2)/2-14), label, font=FL, fill=INK, anchor="lm")

# dashed off-chain / on-chain boundary
BX = 1220
yy = 4
while yy < H0-4:
    d.line([BX, yy, BX, min(yy+10, H0-4)], fill=(110, 110, 110), width=2)
    yy += 18

# pipeline row
Y1, BH, GAP = 30, 158, 34
BW = 211
xs = [12 + i*(BW+GAP) for i in range(6)]
box(xs[0], Y1, BW, BH, "Resident", ["multilingual UI", "5 locales + MT", "RTL, WCAG 2.2"])
box(xs[1], Y1, BW, BH, "Next.js 16", ["route handlers", "actor() auth", "HMAC session"])
box(xs[2], Y1, BW, BH, "AI layer", ["Gemini", "generateObject", "zod schema"])
box(xs[3], Y1, BW, BH, "Supabase", ["PostgreSQL +", "row-level", "security"])
box(xs[4], Y1, BW, BH, "Digest", ["SHA-256(", "  salt ‖ canonical", "  (snapshot) )"])
box(xs[5], Y1, BW, BH, "Polygon Amoy", ["testnet 80002", "SANADCredential", ".issue(id, h)"])
for i in range(5):
    arrow(xs[i]+BW, Y1+BH/2, xs[i+1]-3, Y1+BH/2)

# official catalog feeding the AI layer
CX, CY, CW, CH = 477, 285, 261, 118
box(CX, CY, CW, CH, "Catalog", ["28 verified entries", "u.ae / MOHRE"])
arrow(CX+CW/2, CY-2, xs[2]+BW/2, Y1+BH+2, None)
d.text((CX+CW+16, CY+28), "grounded matches:\ncatalog IDs only,\nnever invented", font=font(19), fill=INK, anchor="la")
arrow(xs[1]+BW/2+30, Y1+BH+2, CX+24, CY-2, None)

# public verifier reading the chain
VX, VY, VW, VH2 = 980, 428, 468, 190
box(VX, VY, VW, VH2, "Public verifier (/verify)", ["status(id) -> hash, issuer,", "timestamp, revoked flag", "existence & immutability,", "never factual truth"])
arrow(xs[5]+BW/2, Y1+BH+2, xs[5]+BW/2, VY-2, "reads")

# boundary labels
d.text((BX-8, H0-14), "off-chain: PII stays in RLS tables", font=font(18), fill=(70, 70, 70), anchor="rs")
d.text((BX+8, H0-32), "on-chain: opaque id +", font=font(18), fill=(70, 70, 70), anchor="ls")
d.text((BX+8, H0-10), "32-byte hash only", font=font(18), fill=(70, 70, 70), anchor="ls")

img.save("paper/fig1_architecture.png")
print("saved paper/fig1_architecture.png", img.size)
