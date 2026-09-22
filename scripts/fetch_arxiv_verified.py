#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Download verified arXiv PDFs for 84-page PPT theme gaps."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(r"F:/project/AIMathTophiloso")
PDF = ROOT / "PDF"
EXT = PDF / "_extracted"
EXT.mkdir(exist_ok=True)
MANIFEST = PDF / "_arxiv_verified_manifest.json"

# Verified / high-confidence arXiv IDs ↔ PPT themes
PAPERS = [
    ("2109.00110", "miniF2F_formal_math_olympiad_benchmark.pdf", "P.3 Lean ATP benchmark"),
    ("1910.09336", "The_Lean_mathematical_library_mathlib.pdf", "P.3 Mathlib"),
    ("2208.04024", "Social_Simulacra_Park_et_al.pdf", "P.50 Social Simulacra"),
    ("2304.03279", "MACHIAVELLI_benchmark_agents_arxiv.pdf", "P.56-57 Machiavelli bias"),
    ("2210.03629", "ReAct_Synergizing_Reasoning_and_Acting_in_Language_Models.pdf", "P.17 Agent loop"),
    ("2303.11366", "Reflexion_Language_Agents_with_Verbal_Reinforcement_Learning.pdf", "P.17 Agent harness loop"),
    ("2405.15793", "SWE_agent_Agent_Computer_Interfaces_Enable_Software_Engineering.pdf", "P.17 Harness / tools"),
    ("2004.10521", "Causal_Inference_Machine_Learning_Survey.pdf", "P.51 SCM / causal"),
    ("1809.10597", "p_bits_for_probabilistic_spin_logic_Camsari.pdf", "P.40 p-bit thermo"),
    ("1307.7090", "On_the_finite_time_blowup_of_3D_Euler_related.pdf", "P.39 Euler blowup"),
    ("1106.3113", "Reverse_Mathematics_What_why_how_survey.pdf", "P.23 Reverse Math"),
    ("1402.6050", "Formalization_Godel_Ontological_Proof_Benzmueller.pdf", "P.70 Godel modal"),
    ("cs/0602028", "Gonthier_Formal_Proof_Four_Colour_Theorem.pdf", "P.32 Four color"),
    ("2305.20050", "Llemma_Open_Language_Model_for_Mathematics.pdf", "P.4 AI math"),
    ("2402.03300", "DeepSeekMath_Pushing_Limits_Mathematical_Reasoning.pdf", "P.4 AI math"),
    ("2308.11432", "Is_ChatGPT_Good_at_Math_survey_or_related.pdf", "P.4 check title"),
    ("2310.10631", "ToRA_Tool_integrated_Reasoning_Agent_Math.pdf", "P.17 tools+math"),
    ("2406.06357", "OlympiadBench_Challenging_Bilingual_Olympiad.pdf", "P.4 olympiad AI"),
    ("2205.02325", "Singularity_formation_Euler_equations_related.pdf", "P.39 fluid"),
    ("1908.07565", "Survey_Computational_Approaches_Literary_DH.pdf", "P.52 digital humanities"),
    ("2306.13131", "Are_LLMs_Good_at_Math_reasoning_survey.pdf", "P.4 check"),
    ("2408.03350", "A_Survey_on_Deep_Learning_for_Theorem_Proving.pdf", "P.3 ATP survey"),
    ("2206.04079", "HyperTree_Proof_Search_or_related.pdf", "P.3 proof search"),
    ("2305.18882", "LeanDojo_related_check.pdf", "P.3 check"),  # may duplicate LeanDojo theme
    ("2501.07163", "AI_Mathematical_Olympiad_or_related.pdf", "P.4 check"),
]


def http_get(url: str) -> bytes:
    req = Request(
        url,
        headers={
            "User-Agent": "AIMathTophiloso/1.0 (research seminar corpus)",
            "Accept": "application/pdf,application/atom+xml,application/xml,*/*",
        },
    )
    with urlopen(req, timeout=180) as r:
        return r.read()


def fetch_meta(aid: str) -> dict:
    xml = http_get(f"http://export.arxiv.org/api/query?id_list={aid}&max_results=1").decode(
        "utf-8", errors="replace"
    )
    def tg(name):
        m = re.search(rf"<{name}[^>]*>(.*?)</{name}>", xml, re.S)
        return " ".join(m.group(1).split()) if m else ""
    authors = re.findall(r"<name>(.*?)</name>", xml)
    ym = re.search(r"<published>(\d{4})", xml)
    return {
        "title": tg("title"),
        "summary": tg("summary")[:1100],
        "authors": authors[:10],
        "year": int(ym.group(1)) if ym else None,
    }


def main():
    out = []
    for aid, fname, theme in PAPERS:
        dest = PDF / fname
        if dest.exists() and dest.stat().st_size > 40000:
            print(f"[SKIP] {fname}")
            try:
                meta = fetch_meta(aid)
                time.sleep(2.2)
            except Exception:
                meta = {}
            out.append({"arxiv_id": aid, "filename": fname, "theme": theme, "ok": True, "via": "already", **meta})
            continue
        print(f"[GET] {aid}")
        try:
            raw = http_get(f"https://arxiv.org/pdf/{aid}.pdf")
            meta = fetch_meta(aid)
            time.sleep(2.5)
        except Exception as e:
            print("  ERR", e)
            out.append({"arxiv_id": aid, "filename": fname, "theme": theme, "ok": False, "error": str(e)})
            time.sleep(2)
            continue
        if raw[:4] != b"%PDF" or len(raw) < 20000:
            print("  bad", len(raw))
            out.append({"arxiv_id": aid, "filename": fname, "theme": theme, "ok": False, "error": "bad pdf"})
            continue
        # rename check_* files based on real title
        if "check" in fname or "related" in fname:
            title = meta.get("title") or aid
            safe = re.sub(r"[^A-Za-z0-9]+", "_", title)[:70].strip("_")
            fname = f"{aid.replace('/', '_')}_{safe}.pdf"
            dest = PDF / fname
        dest.write_bytes(raw)
        try:
            from pypdf import PdfReader
            r = PdfReader(str(dest))
            text = "\n".join((p.extract_text() or "")[:2200] for p in r.pages[:4])
            (EXT / f"arxiv_{aid.replace('/', '_')}.txt").write_text(text, encoding="utf-8")
        except Exception:
            (EXT / f"arxiv_{aid.replace('/', '_')}.txt").write_text(meta.get("summary", ""), encoding="utf-8")
        print(f"  OK {len(raw)} | {meta.get('title','')[:75]}")
        out.append({"arxiv_id": aid, "filename": fname, "theme": theme, "ok": True, "via": "download", "bytes": len(raw), **meta})
        time.sleep(1)

    MANIFEST.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Done", sum(1 for x in out if x.get("ok")), "/", len(out))


if __name__ == "__main__":
    main()
