#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Download only verified arXiv IDs; reject PDFs whose title doesn't match keywords."""
from __future__ import annotations

import json
import re
import time
from pathlib import Path
from urllib.request import Request, urlopen
from pypdf import PdfReader

ROOT = Path(r"F:/project/AIMathTophiloso")
PDF = ROOT / "PDF"
EXT = PDF / "_extracted"
EXT.mkdir(exist_ok=True)

# Wrong downloads from bad IDs — remove if present
WRONG = [
    "FrontierMath_or_related.pdf",
    "HyperTree_Proof_Search_AlphaZero_math.pdf",
    "Mathematical_Language_Models_Survey.pdf",
    "Survey_Computational_Approaches_Literary_DH.pdf",
    "Singularity_formation_Euler_equations_related.pdf",
    "OlympiadBench_Challenging_Bilingual_Olympiad.pdf",
    "Gonthier_Formal_Proof_Four_Colour_Theorem.pdf",
    "Formalization_Godel_Ontological_Proof_Benzmueller.pdf",
    "Reverse_Mathematics_What_why_how_survey.pdf",
    "p_bits_for_probabilistic_spin_logic_Camsari.pdf",
    "On_the_finite_time_blowup_of_3D_Euler_related.pdf",
    "2305.18882_Draft_Proof_Autoformalization_related.pdf",
    "LeanDojo_related_check.pdf",
    "Draft_Bang_Lean_hammer_or_related.pdf",
    "LeanStar_or_related_Lean_prover.pdf",
    "Is_ChatGPT_Good_at_Math_survey_or_related.pdf",
    "Beale_Kato_Majda_criterion_survey_or_related_arxiv.pdf",
    "Bourgain_Gibbs_measure_NLS_related_arxiv.pdf",
    "Euler_blowup_smooth_forcing_related_arxiv.pdf",
    "AlphaProof_formal_mathematical_reasoning_Nature_arxiv.pdf",
    "AlphaGeometry_Trinh_et_al_original.pdf",
    "FunSearch_Mathematical_Discoveries_from_Program_Search.pdf",
    "Reverse_Mathematics_Simpson_style_survey_arxiv.pdf",
    "Strict_Reverse_Mathematics_Friedman_arxiv.pdf",
    "Causal_Inference_SCM_survey_arxiv.pdf",
    "Thermodynamic_computing_pbit_arxiv.pdf",
    "LLM_Agent_Harness_or_tool_use_arxiv.pdf",
    "SWE_agent_or_OpenHands_agent_scaffold_arxiv.pdf",
    "Curry_Howard_correspondence_survey_arxiv.pdf",
    "Godel_ontological_argument_formalization_Lean_arxiv.pdf",
    "Computational_distant_reading_digital_humanities_arxiv.pdf",
    "Four_color_theorem_formalization_or_algorithm_arxiv.pdf",
    "AI_mathematical_discovery_structure_arxiv.pdf",
    "AlphaGeometry_deepmind_companion_arxiv.pdf",
]

# (arxiv_id, filename, must_match_regex, theme, kb_id)
VERIFIED = [
    ("2210.03629", "ReAct_Synergizing_Reasoning_and_Acting_in_Language_Models.pdf",
     r"ReAct|Reasoning\s+and\s+Acting", "P.17 Agent loop", "doc-react-01"),
    ("2303.11366", "Reflexion_Language_Agents_with_Verbal_Reinforcement_Learning.pdf",
     r"Reflexion", "P.17 Agent harness", "doc-reflexion-01"),
    ("2405.15793", "SWE_agent_Agent_Computer_Interfaces_Enable_Software_Engineering.pdf",
     r"SWE-agent|Agent-Computer", "P.17 Harness/tools", "doc-sweagent-01"),
    ("2305.20050", "Llemma_Open_Language_Model_for_Mathematics.pdf",
     r"Llemma|LLEMMA", "P.4 AI math LM", "doc-llemma-01"),
    ("2402.03300", "DeepSeekMath_Pushing_Limits_Mathematical_Reasoning.pdf",
     r"DeepSeekMath", "P.4 AI math", "doc-deepseekmath-01"),
    ("2109.00110", "miniF2F_formal_math_olympiad_benchmark.pdf",
     r"miniF2F|MINIF2F", "P.3 ATP bench", "doc-minif2f-01"),
    ("1910.09336", "The_Lean_mathematical_library_mathlib.pdf",
     r"mathlib|mathematical library", "P.3 Mathlib", "doc-mathlib-01"),
    ("2208.04024", "Social_Simulacra_Park_et_al.pdf",
     r"Social Simulacra|Simulacra", "P.50", "doc-social-simulacra-01"),
    ("2304.03279", "MACHIAVELLI_benchmark_agents_arxiv.pdf",
     r"MACHIAVELLI|Machiavelli", "P.56-57", "doc-machiavelli-01"),
    ("2004.10521", "Causal_Inference_Efficient_Adjustment_Sets_Graphical_Models.pdf",
     r"causal|adjustment", "P.51 SCM", "doc-causal-adj-01"),
    ("2205.11491", "HyperTree_Proof_Search_for_Neural_Theorem_Proving.pdf",
     r"HyperTree|Hypertree|proof search", "P.3 proof search", "doc-hypertree-01"),
    ("1308.4526", "Formalization_Godels_Ontological_Proof_Benzmueller_Paleo.pdf",
     r"Ontological|G.?del|Godel", "P.70", "doc-godel-ontological-01"),
    ("1610.00378", "p_bits_for_probabilistic_spin_logic.pdf",
     r"p-bit|p.bit|probabilistic spin", "P.40", "doc-pbit-01"),
    ("2402.14008", "OlympiadBench_Challenging_Bilingual_Olympiad_Benchmark.pdf",
     r"OlympiadBench|Olympiad", "P.4", "doc-olympiadbench-01"),
    ("2309.17453", "ToRA_Tool_integrated_Reasoning_Agent_for_Mathematical.pdf",
     r"ToRA|Tool-Integrated", "P.17 tools+math", "doc-tora-01"),
    ("2408.03191", "miniCTX_Neural_Theorem_Proving_with_Contexts.pdf",
     r"miniCTX|CONTEXT", "P.3 NTP context", "doc-minictx-01"),
    ("2404.09939", "A_Survey_of_Deep_Learning_for_Theorem_Proving.pdf",
     r"Survey|Theorem Proving|theorem proving", "P.3 ATP survey", "doc-atp-survey-01"),
    ("2312.08935", "Mathematical_Language_Models_A_Survey.pdf",
     r"Mathematical Language|survey|Survey", "P.4", "doc-mathlm-survey-01"),
    ("1408.0852", "Reverse_Mathematics_combinatorial_principles.pdf",
     r"Reverse Mathematics|reverse mathematics", "P.23", "doc-rm-combinatorial-01"),
    ("2206.08826", "Draft_Autoformalization_with_LLMs_related.pdf",
     r"autoformal|formalization|Lean", "P.3", "doc-autoformal-01"),
]


def http_get(url: str) -> bytes:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "application/pdf,*/*",
        },
    )
    with urlopen(req, timeout=180) as r:
        return r.read()


def first_page_text(path: Path) -> str:
    r = PdfReader(str(path))
    return r.pages[0].extract_text() or ""


def main():
    for name in WRONG:
        p = PDF / name
        if p.exists():
            # only delete if clearly mismatched small/wrong — keep if user may want
            # delete all listed wrong names
            p.unlink()
            print("removed", name)

    # rename mislabeled LLEMMA if saved as ToRA
    tora = PDF / "ToRA_Tool_integrated_Reasoning_Agent_Math.pdf"
    if tora.exists():
        head = first_page_text(tora)[:300]
        if re.search(r"LLEMMA|Llemma", head, re.I) and not re.search(r"ToRA", head):
            dest = PDF / "Llemma_Open_Language_Model_for_Mathematics.pdf"
            if not dest.exists():
                tora.rename(dest)
                print("renamed ToRA file -> Llemma")
            else:
                tora.unlink()
                print("removed duplicate ToRA(Llemma)")

    # rename miniCTX misnamed survey file
    survey = PDF / "A_Survey_on_Deep_Learning_for_Theorem_Proving.pdf"
    if survey.exists():
        head = first_page_text(survey)[:400]
        if re.search(r"miniCTX", head, re.I):
            dest = PDF / "miniCTX_Neural_Theorem_Proving_with_Contexts.pdf"
            if not dest.exists():
                survey.rename(dest)
                print("renamed survey->miniCTX")
            else:
                survey.unlink()

    results = []
    for aid, fname, pat, theme, kid in VERIFIED:
        dest = PDF / fname
        if dest.exists() and dest.stat().st_size > 30000:
            head = first_page_text(dest)[:800]
            if not re.search(pat, head, re.I):
                print("REJECT existing", fname, "head:", head[:100].replace("\n", " "))
                dest.unlink()
            else:
                text = "\n".join((p.extract_text() or "")[:2000] for p in PdfReader(str(dest)).pages[:4])
                (EXT / f"arxiv_{aid.replace('/', '_')}.txt").write_text(text, encoding="utf-8")
                title = head.split("\n")[0][:140]
                print("KEEP", aid, title[:70])
                results.append({"arxiv_id": aid, "filename": fname, "ok": True, "via": "keep", "theme": theme, "kb_id": kid, "title": title, "snippet": head[:900]})
                continue

        print("GET", aid)
        try:
            raw = http_get(f"https://arxiv.org/pdf/{aid}.pdf")
        except Exception as e:
            print(" fail", e)
            results.append({"arxiv_id": aid, "ok": False, "error": str(e), "kb_id": kid})
            time.sleep(3)
            continue
        if raw[:4] != b"%PDF" or len(raw) < 20000:
            print(" bad pdf", len(raw))
            results.append({"arxiv_id": aid, "ok": False, "error": "bad", "kb_id": kid})
            time.sleep(2)
            continue
        dest.write_bytes(raw)
        head = first_page_text(dest)[:800]
        if not re.search(pat, head, re.I):
            print("REJECT", aid, head[:120].replace("\n", " "))
            dest.unlink()
            results.append({"arxiv_id": aid, "ok": False, "error": "title mismatch", "head": head[:200], "kb_id": kid})
        else:
            text = "\n".join((p.extract_text() or "")[:2000] for p in PdfReader(str(dest)).pages[:4])
            (EXT / f"arxiv_{aid.replace('/', '_')}.txt").write_text(text, encoding="utf-8")
            title = head.split("\n")[0][:140]
            print("OK", aid, len(raw), title[:70])
            results.append({"arxiv_id": aid, "filename": fname, "ok": True, "via": "download", "bytes": len(raw), "theme": theme, "kb_id": kid, "title": title, "snippet": head[:900]})
        time.sleep(2.5)

    (PDF / "_arxiv_verified_ok.json").write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print("OK count", sum(1 for r in results if r.get("ok")), "/", len(results))


if __name__ == "__main__":
    main()
