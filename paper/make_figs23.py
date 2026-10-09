"""Fig.2 = 2x2 UI montage (real screenshots at deviceScaleFactor 3, translate
bar cropped).  Fig.3 = evaluation charts rendered at S=2 (~610 dpi at print)."""
import json
from PIL import Image, ImageDraw, ImageFont

def font(sz, bold=False, scale=1):
    for n in ["segoeui-bold.ttf" if bold else "segoeui.ttf",
              "arialbd.ttf" if bold else "arial.ttf"]:
        try: return ImageFont.truetype("C:/Windows/Fonts/"+n, int(sz*scale))
        except Exception: pass
    return ImageFont.load_default()
INK=(25,25,25); GREEN=(4,106,56); GOLD=(201,162,39)

# ---------------- Fig 2: UI montage ----------------
TOP=130  # crop Google-translate toolbar (border ~110 + shadow to ~125, DSF 3)
panels=[("shot_chat.png","(a) Situation intake: voice + multilingual example chips"),
        ("shot_dashboard.png","(b) Dashboard: honest sign-in banner + journey"),
        ("shot_services.png","(c) Services: relevance tags, Verified + Docs-required"),
        ("shot_verify.png","(d) Public verifier: credential ID -> on-chain proof")]
PW=1920
K = PW/1180  # scale factor vs the previous 1180-px design
crops=[]
for fn,_ in panels:
    im=Image.open("paper/"+fn).convert("RGB")
    if fn=="shot_verify.png":
        # toolbar overlays this page's nav; crop the clean content band only
        im=im.crop((0,500,im.width,2140))
    else:
        im=im.crop((0,TOP,im.width,im.height))
    h=round(PW*im.height/im.width)
    crops.append(im.resize((PW,h), Image.LANCZOS))
GAP=round(24*K); LBL=round(46*K)
def grid_row(a,b):
    h=max(a.height,b.height)
    row=Image.new("RGB",(PW*2+GAP,h),(255,255,255))
    row.paste(a,(0,(h-a.height)//2)); row.paste(b,(PW+GAP,(h-b.height)//2))
    return row
r1=grid_row(crops[0],crops[1]); r2=grid_row(crops[2],crops[3])
W=PW*2+GAP; H=r1.height+r2.height+GAP+LBL*2
fig2=Image.new("RGB",(W,H),(255,255,255))
d=ImageDraw.Draw(fig2)
fig2.paste(r1,(0,LBL)); fig2.paste(r2,(0,LBL+r1.height+GAP+LBL))
FL=font(30, scale=K)
d.text((4,LBL-38*K),panels[0][1],font=FL,fill=INK)
d.text((PW+GAP+4,LBL-38*K),panels[1][1],font=FL,fill=INK)
d.text((4,LBL+r1.height+GAP+LBL-38*K),panels[2][1],font=FL,fill=INK)
d.text((PW+GAP+4,LBL+r1.height+GAP+LBL-38*K),panels[3][1],font=FL,fill=INK)
fig2.save("paper/fig2_interfaces.png"); print("fig2",fig2.size)

# ---------------- Fig 3: evaluation ----------------
S=2
data=json.load(open("paper/eval_results.json",encoding="utf-8"))
res=data["results"]; summ=data["summary"]
CW0,CH0=1300,780; CW,CH=CW0*S,CH0*S
fig3=Image.new("RGB",(CW,CH),(255,255,255))

class SD:
    """Scale positional coordinates and the `width` kwarg by S."""
    def __init__(self, dr): self.dr = dr
    def _p(self, a):
        if isinstance(a,(int,float)): return a*S
        if isinstance(a,(tuple,list)): return type(a)(self._p(x) for x in a)
        return a
    def __getattr__(self, name):
        attr=getattr(self.dr,name)
        def call(*args,**kw):
            kw={k:(self._p(v) if k=="width" else v) for k,v in kw.items()}
            return attr(*[self._p(a) for a in args],**kw)
        return call
d=SD(ImageDraw.Draw(fig3))
FT=font(30,True,S); FS=font(24,False,S); FX=font(22,True,S)
# left: hit@1 by language group
groups={"English":[],"Hinglish /\nRoman Urdu":[],"Arabic":[],"Hindi\n(Devanagari)":[],"Bengali":[]}
key={"English (UK)":"English","Hinglish":"Hinglish /\nRoman Urdu","Roman Urdu":"Hinglish /\nRoman Urdu",
     "Arabic":"Arabic","Hindi (Devanagari)":"Hindi\n(Devanagari)","Bengali":"Bengali"}
for r in res:
    g=key[r["lang"]]; groups[g].append(r["hit1"])
LX,LY,LW,LH=70,120,500,500
d.text((LX,44),"Hit@1 by input language",font=FT,fill=INK)
base=LY+LH
bw=LW//len(groups)
for i,(g,v) in enumerate(groups.items()):
    pct=100*sum(v)/len(v) if v else 0
    bh=int(LH*pct/100)
    x=LX+i*bw+10
    d.rectangle([x,base-bh,x+bw-24,base],fill=GREEN)
    d.text((x+(bw-24)//2,base-bh-34),f"{pct:.0f}%",font=FX,fill=INK,anchor="ma")
    d.text((x+(bw-24)//2,base-24),f"n={len(v)}",font=font(18,True,S),fill=(255,255,255),anchor="ma")
    for j,ln in enumerate(g.split("\n")):
        d.text((x+(bw-24)//2,base+8+j*24),ln,font=font(18,False,S),fill=INK,anchor="ma")
d.line([LX,base,LX+LW,base],fill=INK,width=2)
# right: per-case latency
RX,RY,RW,RH=720,120,500,500
d.text((RX,44),"Latency per case (ms)",font=FT,fill=INK)
lats=[r["ms"] for r in res]; mx=max(lats); base2=RY+RH
bw2=RW//len(lats)
med=sorted(lats)[len(lats)//2]
d.line([RX,base2-int(RH*med/mx),RX+RW,base2-int(RH*med/mx)],fill=GOLD,width=3)
d.text((RX+RW-4,base2-int(RH*med/mx)-30),f"median {med}ms",font=font(20,True,S),fill=GOLD,anchor="ra")
for i,ms in enumerate(lats):
    bh=int(RH*ms/mx); x=RX+i*bw2+3
    d.rectangle([x,base2-bh,x+bw2-6,base2],fill=(30,60,90))
d.line([RX,base2,RX+RW,base2],fill=INK,width=2)
d.text((RX,base2+8),"T01",font=font(18,False,S),fill=INK); d.text((RX+RW-30,base2+8),"T16",font=font(18,False,S),fill=INK)
d.line([660,110,660,620],fill=(200,200,200),width=2)
# footer stat strip
d.rectangle([40,CH0-92,CW0-40,CH0-24],outline=INK,width=2,fill=(247,248,251))
stat=(f"16/16 hit@1 & hit@3   |   0 out-of-catalog IDs   |   "
      f"{summ['avg_matches_returned']} matches/case   |   "
      f"{summ['first_attempt_api_success']} first-try API success")
d.text((CW0/2,CH0-58),stat,font=font(24,True,S),fill=INK,anchor="mm")
fig3.save("paper/fig3_evaluation.png"); print("fig3",fig3.size)
