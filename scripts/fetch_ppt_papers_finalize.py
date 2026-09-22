#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path
from urllib.request import Request, urlopen
from pypdf import PdfReader

ROOT = Path(r"F:/project/AIMathTophiloso")
PDF = ROOT / "PDF"
EXT = PDF / "_extracted"
KEY = None
for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
    if line.startswith("FIRECRAWL_API_KEY="):
        KEY = line.split("=", 1)[1].strip().strip('"')
        break


def get(u):
    req = Request(u, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=180) as r:
        return r.read()


def fc_search(q):
    data = json.dumps({"query": q, "limit": 6}).encode()
    req = Request(
        "https://api.firecrawl.dev/v1/search",
        data=data,
        method="POST",
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    with urlopen(req, timeout=90) as r:
        return json.loads(r.read().decode())


print("=== AlphaGeometry original ===")
sr = fc_search("Solving Olympiad Geometry without Human Demonstrations Trinh site:arxiv.org")
for d in sr.get("data") or []:
    print(" ", d.get("url"))
for d in sr.get("data") or []:
    u = d.get("url") or ""
    m = re.search(r"arxiv.org/(?:pdf|abs|html)/(\d{4}\.\d+)", u)
    if not m:
        continue
    pdf = f"https://arxiv.org/pdf/{m.group(1)}.pdf"
    try:
        raw = get(pdf)
        if raw[:4] == b"%PDF":
            (PDF / "AlphaGeometry_Solving_Olympiad_Geometry_without_Human_Demonstrations.pdf").write_bytes(raw)
            print("saved AG1", len(raw), pdf)
            break
    except Exception as e:
        print("ag fail", e)

print("=== Friedman entire book ===")
u = "https://bpb-us-w2.wpmucdn.com/u.osu.edu/dist/1/1952/files/2014/01/0EntireBook061311-wh0yjy.pdf"
try:
    raw = get(u)
    if raw[:4] == b"%PDF":
        (PDF / "Friedman_Boolean_Relation_Theory_EntireBook.pdf").write_bytes(raw)
        print("saved friedman book", len(raw))
except Exception as e:
    print("book fail", e)

chae = PDF / "Beale_Kato_Majda_Remarks_on_breakdown_of_smooth_solutions_Euler.pdf"
dest = PDF / "Chae_Remarks_on_blowup_criterion_3D_Euler_citing_BKM.pdf"
if chae.exists() and not dest.exists():
    dest.write_bytes(chae.read_bytes())
    print("copied Chae alias")

for name in [
    "Boeckeler_Harness_engineering_for_coding_agent_users.md",
    "DeepMind_AI_achieves_silver_medal_standard_IMO_AlphaProof.md",
]:
    src = EXT / name
    if src.exists():
        (PDF / name).write_bytes(src.read_bytes())
        print("copied", name)


def extract(src: Path, out_name: str, n=4):
    if not src.exists():
        print("miss", src)
        return
    r = PdfReader(str(src))
    t = "\n".join((p.extract_text() or "")[:2500] for p in r.pages[:n])
    (EXT / out_name).write_text(t, encoding="utf-8")
    print(src.name, "pages", len(r.pages), "chars", len(t))


extract(PDF / "Shiu_et_al_A_Drosophila_computational_brain_model_Nature_2024.pdf", "Shiu_Drosophila_brain_model.txt")
extract(PDF / "Friedman_Concrete_Mathematical_Incompleteness.pdf", "Friedman_EBRT.txt")
ag1 = PDF / "AlphaGeometry_Solving_Olympiad_Geometry_without_Human_Demonstrations.pdf"
if ag1.exists():
    extract(ag1, "AlphaGeometry1.txt")
print("done")
