"""Count the abstract words produced by build_paper.py's abstract block."""
import ast
import re

src = open("paper/build_paper.py", encoding="utf-8").read()
start = src.index('"Abstract.  "')
end = src.index("Keywords")
block = src[start:end]

# Extract every string literal in the block and evaluate escapes properly.
parts = re.findall(r'"(?:[^"\\]|\\.)*"', block)
text = "".join(ast.literal_eval(p) for p in parts[1:])  # skip 'Abstract.  '
print("abstract words:", len(text.split()))
