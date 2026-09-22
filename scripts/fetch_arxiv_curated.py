#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Direct-download curated arXiv IDs matching 84-page PPT themes."""
from __future__ import annotations

import json
import time
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(r"F:/project/AIMathTophiloso")
PDF = ROOT / "PDF"
EXT = PDF / "_extracted"
EXT.mkdir(exist_ok=True)
MANIFEST = PDF / "_arxiv_curated_manifest.json"

# Known arXiv IDs mapped to PPT themes (skip if file already large)
CURATED = [
    # Lean / formal math
    ("2109.00110", "miniF2F_formal_math_olympiad_benchmark.pdf", "miniF2F", "P.3"),
    ("1910.09336", "The_Lean_mathematical_library_mathlib.pdf", "mathlib", "P.3"),
    ("2203.09076", "The_Lean_4_Theorem_Prover_and_Programming_Language.pdf", "Lean4", "P.3"),
    ("2305.18882", "Draft_Bang_Lean_hammer_or_related.pdf", "skip_if_bad", "P.3"),  # may replace
    ("2405.17216", "LeanStar_or_related_Lean_prover.pdf", "skip_if_bad", "P.3"),
    # Social / agents
    ("2208.04024", "Social_Simulacra_Park_et_al.pdf", "Social Simulacra", "P.50"),
    ("2304.03279", "MACHIAVELLI_benchmark_agents_arxiv.pdf", "MACHIAVELLI", "P.57"),
    ("2308.10848", "Generative_Agents_survey_or_related.pdf", "skip_if_bad", "P.47"),
    # Math discovery / olympiad AI
    ("2312.09284", "FunSearch_related_or_check.pdf", "skip_if_bad", "P.10"),
    ("2402.14810", "AlphaGeometry_related_check.pdf", "skip_if_bad", "P.4"),
    # Reverse math / logic
    ("1408.0852", "Reverse_Mathematics_Foundations_Stillwell_or_survey.pdf", "skip_if_bad", "P.23"),
    ("1106.3113", "Reverse_Mathematics_survey_arxiv.pdf", "RM survey", "P.23"),
    ("1801.01092", "Reverse_Mathematics_Hirschfeldt_notes.pdf", "skip_if_bad", "P.23"),
    # Euler / PDE
    ("2309.08495", "Cordoba_Martinez_Zoroa_infinite_cascade_blowup.pdf", "Cordoba", "P.39"),  # already
    ("2205.02325", "Finite_time_blowup_Euler_related.pdf", "Euler blowup", "P.39"),
    ("math/0501442", "Bourgain_related_id_check.pdf", "skip_if_bad", "P.37"),
    ("math/0009227", "Bourgain_Gibbs_measure_related.pdf", "skip_if_bad", "P.37"),
    ("1307.7090", "Beale_Kato_Majda_related_arxiv.pdf", "BKM related", "P.39"),
    # Causal
    ("1305.5506", "Causal_Inference_Elements_Pearl_style.pdf", "skip_if_bad", "P.51"),
    ("2004.10521", "Causal_Inference_Survey_machine_learning.pdf", "Causal ML survey", "P.51"),
    # Thermodynamic / p-bit
    ("1809.10597", "Probabilistic_bits_pbit_Camsari.pdf", "p-bit", "P.40"),
    ("2108.08805", "Thermodynamic_AI_computing_related.pdf", "thermo AI", "P.40"),
    # Agent scaffolds / harness-like
    ("2405.15793", "SWE_agent_Language_Agents_Software_Engineering.pdf", "SWE-agent", "P.17"),
    ("2407.16741", "OpenHands_CodeAct_or_related.pdf", "skip_if_bad", "P.17"),
    ("2303.11366", "Reflexion_language_agents_verbal_reinforcement.pdf", "Reflexion", "P.17"),
    ("2210.03629", "ReAct_reasoning_acting_language_models.pdf", "ReAct", "P.17"),
    # Curry-Howard / formal verification philosophy-adjacent
    ("1904.05359", "Propositions_as_Types_Wadler_related.pdf", "skip_if_bad", "P.72"),
    ("1505.04324", "Homotopy_Type_Theory_brief_or_related.pdf", "skip_if_bad", "P.72"),
    ("2005.00929", "Godel_ontological_argument_formalization.pdf", "Godel ontological", "P.70"),
    # Four color
    ("1701.04343", "Four_color_theorem_formal_proof_related.pdf", "skip_if_bad", "P.32"),
    ("math/0410057", "Gonthier_four_color_formalization.pdf", "Four color Gonthier", "P.32"),
    # Distant reading / DH
    ("1505.00564", "Distant_reading_computational_literary.pdf", "skip_if_bad", "P.52"),
    ("1908.07565", "Computational_humanities_NLP_survey.pdf", "DH NLP", "P.52"),
    # Structure / conjecture
    ("2108.13348", "Automated_conjecture_generation_related.pdf", "skip_if_bad", "P.10"),
    ("2306.13131", "LLM_mathematical_reasoning_survey.pdf", "Math LLM survey", "P.4"),
    ("2408.03350", "AI_for_Mathematics_survey_or_related.pdf", "AI4Math", "P.4"),
]


def get(url: str) -> bytes:
    req = Request(
        url,
        headers={
            "User-Agent": "AIMathTophiloso/1.0 (educational; contact: local)",
            "Accept": "application/pdf,*/*",
        },
    )
    with urlopen(req, timeout=180) as r:
        return r.read()


def arxiv_api(aid: str) -> dict | None:
    # old-style ids like math/0410057 need encoding
    q_id = aid
    url = f"http://export.arxiv.org/api/query?id_list={q_id}&max_results=1"
    req = Request(
        url,
        headers={
            "User-Agent": "AIMathTophiloso/1.0",
            "Accept": "application/atom+xml,application/xml,text/xml,*/*",
        },
    )
    try:
        with urlopen(req, timeout=60) as r:
            xml = r.read().decode("utf-8", errors="replace")
    except Exception as e:
        print("api fail", aid, e)
        return None
    if "<entry>" not in xml and "<entry " not in xml:
        return None
    # light parse
    def tag(name):
        import re

        m = re.search(rf"<[^>]*{name}[^>]*>(.*?)</[^>]*{name}>", xml, re.S | re.I)
        return " ".join(m.group(1).split()) if m else ""

    title = tag("title")
    summary = tag("summary")
    # authors
    import re

    authors = re.findall(r"<name>(.*?)</name>", xml)
    year_m = re.search(r"<published>(\d{4})", xml)
    year = int(year_m.group(1)) if year_m else None
    if not title or title.lower().startswith("error"):
        return None
    return {"title": title, "summary": summary[:1200], "authors": authors[:8], "year": year}


def main():
    results = []
    seen_files = set()
    for aid, fname, label, slides in CURATED:
        if label == "skip_if_bad":
            # still try; discard if tiny / wrong
            pass
        dest = PDF / fname
        if dest.exists() and dest.stat().st_size > 30000:
            print(f"[SKIP] {fname}")
            meta = arxiv_api(aid)
            time.sleep(2.5)
            results.append(
                {
                    "arxiv_id": aid,
                    "filename": fname,
                    "ok": True,
                    "via": "already",
                    "bytes": dest.stat().st_size,
                    "label": label,
                    "slides": slides,
                    **(meta or {}),
                }
            )
            continue
        # normalize pdf url
        if "/" in aid and not aid[0].isdigit():
            pdf_url = f"https://arxiv.org/pdf/{aid}.pdf"
        else:
            pdf_url = f"https://arxiv.org/pdf/{aid}.pdf"
        print(f"[GET] {aid} -> {fname}")
        try:
            raw = get(pdf_url)
        except Exception as e:
            print("  fail", e)
            results.append({"arxiv_id": aid, "filename": fname, "ok": False, "error": str(e), "slides": slides})
            time.sleep(2)
            continue
        if raw[:4] != b"%PDF" or len(raw) < 15000:
            print("  not pdf / too small", len(raw))
            results.append({"arxiv_id": aid, "filename": fname, "ok": False, "error": "bad pdf", "slides": slides})
            time.sleep(2)
            continue
        # rename skip_if_bad after meta
        meta = arxiv_api(aid)
        time.sleep(2.5)
        if label == "skip_if_bad" and meta:
            safe = "".join(c if c.isalnum() or c in "-_" else "_" for c in (meta["title"][:60]))
            fname2 = f"{aid.replace('/', '_')}_{safe}.pdf"
            dest = PDF / fname2
            fname = fname2
        dest.write_bytes(raw)
        try:
            from pypdf import PdfReader

            r = PdfReader(str(dest))
            text = "\n".join((p.extract_text() or "")[:2500] for p in r.pages[:4])
            (EXT / f"arxiv_{aid.replace('/', '_')}.txt").write_text(text, encoding="utf-8")
        except Exception:
            text = (meta or {}).get("summary") or ""
            (EXT / f"arxiv_{aid.replace('/', '_')}.txt").write_text(text, encoding="utf-8")
        rec = {
            "arxiv_id": aid,
            "filename": fname,
            "ok": True,
            "via": "download",
            "bytes": len(raw),
            "label": label,
            "slides": slides,
            **(meta or {}),
        }
        results.append(rec)
        print("  ok", len(raw), (meta or {}).get("title", "")[:70])
        time.sleep(1)

    MANIFEST.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    ok = sum(1 for r in results if r.get("ok"))
    print(f"Done {ok}/{len(results)}")


if __name__ == "__main__":
    main()
