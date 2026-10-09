"""Render the revised ISDIA PDF to preview PNGs."""
import fitz, os

os.makedirs("paper/preview_isdia", exist_ok=True)
doc = fitz.open("paper/SANAD_ISDIA_2027_Revised.pdf")
for i, pg in enumerate(doc, 1):
    pix = pg.get_pixmap(matrix=fitz.Matrix(2, 2))
    pix.save("paper/preview_isdia/p%02d.png" % i)
print("pages:", len(doc))
