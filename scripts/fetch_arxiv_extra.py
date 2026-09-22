#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
from urllib.request import Request, urlopen
from pypdf import PdfReader
import time
import re
import json

PDF = Path(r"F:/project/AIMathTophiloso/PDF")
EXT = PDF / "_extracted"

def get(url):
    req = Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/pdf,*/*"})
    with urlopen(req, timeout=180) as r:
        return r.read()

extra = [
    ("2310.10631", "Llemma_Open_Language_Model_for_Mathematics.pdf", r"Llemma|LLEMMA"),
    ("2305.20050", "Lets_Verify_Step_by_Step_Process_Supervision.pdf", r"Verify Step|process supervision|Lightman"),
    ("1704.04235", "p_bits_stochastic_magnetism_Camsari.pdf", r"p-bit|p.bit|probabilistic|Camsari|stochastic|magnet"),
    ("1602.05752", "Higher_Order_Automated_Theorem_Provers_Leo_related.pdf", r"Leo|Ontological|G.?del|theorem"),
]

out = []
for aid, fname, pat in extra:
    dest = PDF / fname
    print("GET", aid)
    try:
        raw = get(f"https://arxiv.org/pdf/{aid}.pdf")
    except Exception as e:
        print("fail", e)
        out.append({"id": aid, "ok": False})
        time.sleep(2)
        continue
    if raw[:4] != b"%PDF" or len(raw) < 15000:
        print("bad", len(raw))
        out.append({"id": aid, "ok": False})
        continue
    dest.write_bytes(raw)
    reader = PdfReader(str(dest))
    head = (reader.pages[0].extract_text() or "")[:700]
    if not re.search(pat, head, re.I):
        print("REJECT", head[:160].replace("\n", " "))
        dest.unlink()
        out.append({"id": aid, "ok": False, "head": head[:200]})
    else:
        text = "\n".join((p.extract_text() or "")[:2000] for p in reader.pages[:4])
        (EXT / ("arxiv_" + aid.replace("/", "_") + ".txt")).write_text(text, encoding="utf-8")
        title = head.split("\n")[0][:120]
        print("OK", len(raw), title[:80])
        out.append({"id": aid, "ok": True, "filename": fname, "title": title, "snippet": head[:900]})
    time.sleep(2.5)

(PDF / "_arxiv_extra_ok.json").write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
print("done", sum(1 for x in out if x.get("ok")))
