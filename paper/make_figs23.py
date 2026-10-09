"""Fig.2 = 2x2 UI montage (real screenshots, translate bar cropped).
   Fig.3 = evaluation: hit@1 by language group + per-case latency."""
import json, math
from PIL import Image, ImageDraw, ImageFont

def font(sz, bold=False):
    for n in ["segoeui-bold.ttf" if bold else "segoeui.ttf",
              "arialbd.ttf" if bold else "arial.ttf"]:
        try: return ImageFont.truetype("C:/Windows/Fonts/"+n, sz)
        except Exception: pass
    return ImageFont.load_default()
INK=(25,25,25); GREEN=(4,106,56); GOLD=(201,162,39)

# ---------------- Fig 2: UI montage ----------------
TOP=150  # crop Google-translate toolbar
panels=[("shot_chat.png","(a) Situation intake: voice + multilingual example chips"),
        ("shot_dashboard.png","(b) Dashboard: honest sign-in banner + journey"),
        ("shot_services.png","(c) Services: relevance tags, Verified + Docs-required"),
        ("shot_verify.png","(d) Public verifier: credential ID -> on-chain proof")]
PW=1180
crops=[]
for fn,_ in panels:
    im=Image.open("paper/"+fn).convert("RGB")
    im=im.crop((0,TOP,im.width,im.height))
    if fn=="shot_verify.png":  # trim empty bottom on verify
        im=im.crop((0,0,im.width,int(im.height*0.80)))
    h=round(PW*im.height/im.width)
    crops.append(im.resize((PW,h)))
GAP=24; LBL=46
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
FL=font(30)
for i,(x,y) in enumerate([(0,LBL+r1.height),(PW+GAP,LBL+r1.height),
                          (0,LBL+r1.height+GAP+r2.height+LBL),(PW+GAP,LBL+r1.height+GAP+r2.height+LBL)]):
    pass
# captions under each panel row
d.text((4,LBL+r1.height-r34 if False else LBL-38),panels[0][1],font=FL,fill=INK)
d.text((PW+GAP+4,LBL-38),panels[1][1],font=FL,fill=INK)
d.text((4,LBL+r1.height+GAP+LBL-38),panels[2][1],font=FL,fill=INK)
d.text((PW+GAP+4,LBL+r1.height+GAP+LBL-38),panels[3][1],font=FL,fill=INK)
fig2.save("paper/fig2_interfaces.png"); print("fig2",fig2.size)

# ---------------- Fig 3: evaluation ----------------
data=json.load(open("paper/eval_results.json",encoding="utf-8"))
res=data["results"]; summ=data["summary"]
CW,CH=1300,780; fig3=Image.new("RGB",(CW,CH),(255,255,255))
d=ImageDraw.Draw(fig3)
FT=font(30,True); FS=font(24); FX=font(22,True)
# left: hit@1 by language group
groups={"English":[],"Hinglish /\nRoman Urdu":[],"Arabic":[],"Hindi\n(Devanagari)":[],"Bengali":[]}
key={"English (UK)":"English","Hinglish":"Hinglish /\nRoman Urdu","Roman Urdu":"Hinglish /\nRoman Urdu",
     "Arabic":"Arabic","Hindi (Devanagari)":"Hindi\n(Devanagari)","Bengali":"Bengali"}
for r in res:
    g=key[r["lang"]]; groups[g].append(r["hit1"])
LX,LY,LW,LH=70,120,500,500
d.text((LX,44),"Hit@1 by input language",font=FT,fill=INK)
base=LY+LH
maxn=max(len(v) for v in groups.values())
bw=LW//len(groups)
for i,(g,v) in enumerate(groups.items()):
    pct=100*sum(v)/len(v) if v else 0
    bh=int(LH*pct/100)
    x=LX+i*bw+10
    d.rectangle([x,base-bh,x+bw-24,base],fill=GREEN)
    d.text((x+(bw-24)//2,base-bh-34),f"{pct:.0f}%",font=FX,fill=INK,anchor="ma")
    d.text((x+(bw-24)//2,base-24),f"n={len(v)}",font=font(18,True),fill=(255,255,255),anchor="ma")
    for j,ln in enumerate(g.split("\n")):
        d.text((x+(bw-24)//2,base+8+j*24),ln,font=font(18),fill=INK,anchor="ma")
d.line([LX,base,LX+LW,base],fill=INK,width=2)
# right: per-case latency
RX,RY,RW,RH=720,120,500,500
d.text((RX,44),"Latency per case (ms)",font=FT,fill=INK)
lats=[r["ms"] for r in res]; mx=max(lats); base2=RY+RH
bw2=RW//len(lats)
med=sorted(lats)[len(lats)//2]
d.line([RX,base2-int(RH*med/mx),RX+RW,base2-int(RH*med/mx)],fill=GOLD,width=3)
d.text((RX+RW-4,base2-int(RH*med/mx)-30),f"median {med}ms",font=font(20,True),fill=GOLD,anchor="ra")
for i,ms in enumerate(lats):
    bh=int(RH*ms/mx); x=RX+i*bw2+3
    d.rectangle([x,base2-bh,x+bw2-6,base2],fill=(30,60,90))
d.line([RX,base2,RX+RW,base2],fill=INK,width=2)
d.text((RX,base2+8),"T01",font=font(18),fill=INK); d.text((RX+RW-30,base2+8),"T16",font=font(18),fill=INK)
d.line([660,110,660,620],fill=(200,200,200),width=2)
# footer stat strip
d.rectangle([40,CH-92,CW-40,CH-24],outline=INK,width=2,fill=(247,248,251))
stat=f"16/16 hit@1 & hit@3   |   0 out-of-catalog IDs   |   {summ['avg_matches_returned']} matches/case   |   {summ['first_attempt_api_success']} first-try API success"
d.text((CW/2,CH-58),stat,font=font(24,True),fill=INK,anchor="mm")
fig3.save("paper/fig3_evaluation.png"); print("fig3",fig3.size)
