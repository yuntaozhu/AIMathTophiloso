#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from pathlib import Path
from urllib.request import Request, urlopen
from pypdf import PdfReader
import time
import json

PDF = Path(r"F:/project/AIMathTophiloso/PDF")
EXT = PDF / "_extracted"
EXT.mkdir(exist_ok=True)

failed = [
    ("2405.15793", "SWE_agent_Agent_Computer_Interfaces_Enable_Software_Engineering.pdf"),
    ("2004.10521", "Causal_Inference_Machine_Learning_Survey.pdf"),
    ("1809.10597", "p_bits_for_probabilistic_spin_logic_Camsari.pdf"),
    ("1307.7090", "On_the_finite_time_blowup_of_3D_Euler_related.pdf"),
    ("1106.3113", "Reverse_Mathematics_What_why_how_survey.pdf"),
    ("1402.6050", "Formalization_Godel_Ontological_Proof_Benzmueller.pdf"),
    ("cs/0602028", "Gonthier_Formal_Proof_Four_Colour_Theorem.pdf"),
    ("2310.10631", "ToRA_Tool_integrated_Reasoning_Agent_Math.pdf"),
    ("2406.06357", "OlympiadBench_Challenging_Bilingual_Olympiad.pdf"),
    ("2205.02325", "Singularity_formation_Euler_equations_related.pdf"),
    ("1908.07565", "Survey_Computational_Approaches_Literary_DH.pdf"),
    ("2306.13131", "Mathematical_Language_Models_Survey.pdf"),
    ("2408.03350", "A_Survey_on_Deep_Learning_for_Theorem_Proving.pdf"),
    ("2206.04079", "HyperTree_Proof_Search_AlphaZero_math.pdf"),
    ("2501.07163", "FrontierMath_or_related.pdf"),
]


def get(url: str):
    last = None
    for attempt in range(3):
        try:
            req = Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    "Accept": "application/pdf,*/*",
                },
            )
            with urlopen(req, timeout=180) as r:
                return r.read()
        except Exception as e:
            last = e
            print(" retry", attempt, e)
            time.sleep(4 + attempt * 3)
    raise last  # type: ignore


print("=== inspect recent pdfs ===")
for p in sorted(PDF.glob("*.pdf"), key=lambda x: -x.stat().st_mtime)[:12]:
    try:
        r = PdfReader(str(p))
        head = (r.pages[0].extract_text() or "")[:200].replace("\n", " | ")
        print(p.name[:55], "|", head[:140])
    except Exception as e:
        print(p.name, e)

print("=== retry ===")
results = []
for aid, fname in failed:
    dest = PDF / fname
    if dest.exists() and dest.stat().st_size > 30000:
        print("have", fname)
        results.append({"arxiv_id": aid, "filename": fname, "ok": True, "via": "have"})
        continue
    ok = False
    for u in (
        f"https://arxiv.org/pdf/{aid}.pdf",
        f"https://export.arxiv.org/pdf/{aid}",
        f"https://arxiv.org/pdf/{aid}v1.pdf",
    ):
        try:
            raw = get(u)
        except Exception as e:
            print("no", aid, u, e)
            continue
        if raw[:4] == b"%PDF" and len(raw) > 20000:
            dest.write_bytes(raw)
            title = ""
            try:
                r = PdfReader(str(dest))
                text = "\n".join((pg.extract_text() or "")[:2000] for pg in r.pages[:4])
                title = ((r.pages[0].extract_text() or "").split("\n")[0])[:140]
                (EXT / ("arxiv_" + aid.replace("/", "_") + ".txt")).write_text(text, encoding="utf-8")
            except Exception:
                pass
            print("OK", aid, len(raw), title[:80])
            results.append({"arxiv_id": aid, "filename": fname, "ok": True, "bytes": len(raw), "title": title})
            ok = True
            break
        else:
            print("bad", aid, len(raw) if raw else 0)
    if not ok:
        results.append({"arxiv_id": aid, "filename": fname, "ok": False})
    time.sleep(2.5)

(PDF / "_arxiv_retry_manifest.json").write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
print("done", sum(1 for r in results if r.get("ok")), "/", len(results))
