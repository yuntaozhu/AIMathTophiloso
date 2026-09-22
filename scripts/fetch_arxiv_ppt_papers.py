#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fetch PPT-theme papers from arXiv API into PDF/ and emit ingest manifest."""
from __future__ import annotations

import json
import re
import time
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(r"F:/project/AIMathTophiloso")
PDF = ROOT / "PDF"
EXT = PDF / "_extracted"
EXT.mkdir(exist_ok=True)
MANIFEST = PDF / "_arxiv_ppt_manifest.json"

# (id, filename, arxiv_id_or_None, search_query, kb_title_hint, slide_tags)
TARGETS = [
    # Formal math / Lean ATP (P.2–4, P.28)
    ("alphaproof-nature", "AlphaProof_formal_mathematical_reasoning_Nature_arxiv.pdf", None,
     'ti:"AI achieves silver" OR all:AlphaProof formal mathematical reasoning IMO Lean',
     "AlphaProof formal reasoning", "P.4"),
    ("minif2f", "miniF2F_formal_math_olympiad_benchmark.pdf", "2109.00110",
     None, "miniF2F benchmark", "P.3"),
    ("mathlib", "The_Lean_mathematical_library_mathlib.pdf", "1910.09336",
     None, "mathlib Lean library", "P.3"),
    ("lean4", "The_Lean_4_Theorem_Prover_and_Programming_Language.pdf", "2203.09076",
     None, "Lean 4 theorem prover", "P.3"),
    ("alphageometry1", "AlphaGeometry_Trinh_et_al_original.pdf", None,
     'ti:"Solving Olympiad Geometry without Human Demonstrations"',
     "AlphaGeometry original", "P.4"),
    ("funsearch", "FunSearch_Mathematical_Discoveries_from_Program_Search.pdf", "2308.xxx",
     'ti:FunSearch mathematical discoveries program search',
     "FunSearch", "P.10"),
    # Reverse math / incompleteness (P.20–27)
    ("reverse-math-survey", "Reverse_Mathematics_Simpson_style_survey_arxiv.pdf", None,
     'ti:"Reverse Mathematics" foundations OR ti:"reverse mathematics" big five RCA0',
     "Reverse Mathematics", "P.23"),
    ("srm-friedman", "Strict_Reverse_Mathematics_Friedman_arxiv.pdf", None,
     'au:Friedman ti:"Strict Reverse Mathematics" OR all:"strict reverse mathematics" Friedman',
     "Strict Reverse Mathematics", "P.25"),
    # PDE / Euler / Bourgain (P.35–39)
    ("bkm-related", "Beale_Kato_Majda_criterion_survey_or_related_arxiv.pdf", None,
     'ti:"Beale-Kato-Majda" OR all:"Beale-Kato-Majda" Euler blow-up criterion',
     "BKM criterion", "P.39"),
    ("bourgain-gibbs", "Bourgain_Gibbs_measure_NLS_related_arxiv.pdf", None,
     'ti:Gibbs measure nonlinear Schrödinger Bourgain OR all:"invariant Gibbs measure" NLS Bourgain',
     "Bourgain Gibbs measures", "P.37"),
    ("euler-smooth-force", "Euler_blowup_smooth_forcing_related_arxiv.pdf", None,
     'ti:blow-up Euler "smooth" forcing OR all:incompressible Euler finite-time singularity forcing Cordoba',
     "Euler blowup forcing", "P.39"),
    # Agents / social sim (P.47–50)
    ("social-simulacra", "Social_Simulacra_Park_et_al.pdf", "2208.04024",
     None, "Social Simulacra", "P.50"),
    ("generative-agents-already", None, "2304.03442", None, None, None),  # skip marker
    # Causal / SCM (P.51)
    ("scm-pearl-survey", "Causal_Inference_SCM_survey_arxiv.pdf", None,
     'ti:"Structural Causal Models" OR ti:"causal graphical models" Pearl survey machine learning',
     "Structural Causal Models", "P.51"),
    # Thermodynamic / p-bit (P.40)
    ("pbit-thermo", "Thermodynamic_computing_pbit_arxiv.pdf", None,
     'ti:p-bit OR ti:"probabilistic bit" thermodynamic computing OR all:"p-bit" Ising',
     "p-bit thermodynamic computing", "P.40"),
    # Harness / agents coding (P.15–17)
    ("agent-harness", "LLM_Agent_Harness_or_tool_use_arxiv.pdf", None,
     'ti:"agent harness" OR all:"tool-augmented" LLM agent sandbox verification coding',
     "Agent harness / tools", "P.17"),
    ("swe-agent", "SWE_agent_or_OpenHands_agent_scaffold_arxiv.pdf", None,
     'ti:"SWE-agent" OR ti:OpenHands software engineering agent',
     "Software eng agent scaffold", "P.17"),
    # Curry-Howard / formal philosophy (P.70–72)
    ("curry-howard", "Curry_Howard_correspondence_survey_arxiv.pdf", None,
     'ti:"Curry-Howard" propositions-as-types survey OR all:"propositions as types" proof assistants',
     "Curry-Howard", "P.72"),
    ("godel-ontological-lean", "Godel_ontological_argument_formalization_Lean_arxiv.pdf", None,
     'all:Gödel ontological argument Lean OR Isabelle formalization',
     "Godel ontological formalization", "P.70"),
    # Multiagent / machiavelli / bias (P.56–57)
    ("machiavelli", "MACHIAVELLI_benchmark_agents_arxiv.pdf", "2304.03279",
     None, "MACHIAVELLI benchmark", "P.57"),
    # Digital humanities / distant reading computational (P.52)
    ("distant-reading", "Computational_distant_reading_digital_humanities_arxiv.pdf", None,
     'ti:"distant reading" OR all:computational literary studies digital humanities NLP',
     "Distant reading / DH", "P.52"),
    # Four color / Appel Haken computational (P.32–34)
    ("four-color", "Four_color_theorem_formalization_or_algorithm_arxiv.pdf", None,
     'ti:"four color" theorem formalization OR all:"four colour theorem" computer assisted Gonthier',
     "Four color theorem", "P.32"),
    # Structure discovery / number theory AI (P.10–12)
    ("ai-math-discovery", "AI_mathematical_discovery_structure_arxiv.pdf", None,
     'ti:"mathematical discovery" language model OR all:automated conjecture generation number theory LLM',
     "AI mathematical discovery", "P.10"),
    # Original AlphaGeometry often cited as Nature; try 2401 or related
    ("alphageometry-dd", "AlphaGeometry_deepmind_companion_arxiv.pdf", None,
     'au:Trinh ti:geometry olympiad OR all:AlphaGeometry synthetic data',
     "AlphaGeometry related", "P.4"),
]


NS = {"a": "http://www.w3.org/2005/Atom"}


def http_get(url: str, timeout: int = 120) -> bytes:
    req = Request(url, headers={"User-Agent": "AIMathTophiloso-arxiv/1.0 (research; mailto:local)"})
    with urlopen(req, timeout=timeout) as resp:
        return resp.read()


def arxiv_query(search_query: str, max_results: int = 5) -> list[dict]:
    q = urllib.parse.urlencode(
        {
            "search_query": search_query,
            "start": 0,
            "max_results": max_results,
            "sortBy": "relevance",
            "sortOrder": "descending",
        }
    )
    url = f"https://export.arxiv.org/api/query?{q}"
    xml = http_get(url, timeout=60).decode("utf-8", errors="replace")
    root = ET.fromstring(xml)
    out = []
    for entry in root.findall("a:entry", NS):
        id_url = (entry.findtext("a:id", default="", namespaces=NS) or "").strip()
        m = re.search(r"arxiv.org/abs/(\d{4}\.\d{4,5})(v\d+)?", id_url)
        aid = m.group(1) if m else None
        title = " ".join((entry.findtext("a:title", default="", namespaces=NS) or "").split())
        summary = " ".join((entry.findtext("a:summary", default="", namespaces=NS) or "").split())
        authors = [
            (a.findtext("a:name", default="", namespaces=NS) or "")
            for a in entry.findall("a:author", NS)
        ]
        published = (entry.findtext("a:published", default="", namespaces=NS) or "")[:4]
        pdf_url = None
        for link in entry.findall("a:link", NS):
            if link.attrib.get("title") == "pdf" or link.attrib.get("type") == "application/pdf":
                pdf_url = link.attrib.get("href")
        if not pdf_url and aid:
            pdf_url = f"https://arxiv.org/pdf/{aid}.pdf"
        out.append(
            {
                "arxiv_id": aid,
                "title": title,
                "summary": summary[:1200],
                "authors": authors,
                "year": int(published) if published.isdigit() else None,
                "pdf_url": pdf_url,
                "abs_url": id_url,
            }
        )
    return out


def resolve_target(t: tuple) -> dict | None:
    tid, filename, fixed_id, query, hint, slides = t
    if filename is None:
        return None
    dest = PDF / filename
    if dest.exists() and dest.stat().st_size > 20000:
        return {
            "id": tid,
            "filename": filename,
            "ok": True,
            "via": "already",
            "bytes": dest.stat().st_size,
            "hint": hint,
            "slides": slides,
        }

    chosen = None
    if fixed_id and not fixed_id.endswith("xxx"):
        chosen = {
            "arxiv_id": fixed_id,
            "title": hint or fixed_id,
            "summary": "",
            "authors": [],
            "year": None,
            "pdf_url": f"https://arxiv.org/pdf/{fixed_id}.pdf",
            "abs_url": f"https://arxiv.org/abs/{fixed_id}",
        }
    else:
        if not query:
            return {"id": tid, "filename": filename, "ok": False, "error": "no query"}
        print(f"[SEARCH] {tid}: {query[:80]}...")
        try:
            hits = arxiv_query(query, max_results=6)
        except Exception as e:
            return {"id": tid, "filename": filename, "ok": False, "error": str(e)}
        time.sleep(3.1)  # arXiv courtesy
        if not hits:
            return {"id": tid, "filename": filename, "ok": False, "error": "no hits"}
        for h in hits:
            print(f"  - {h['arxiv_id']}: {h['title'][:90]}")
        chosen = hits[0]

    assert chosen and chosen.get("pdf_url")
    print(f"[GET] {chosen['pdf_url']}")
    try:
        raw = http_get(chosen["pdf_url"], timeout=180)
    except Exception as e:
        return {"id": tid, "filename": filename, "ok": False, "error": f"download {e}", **chosen}
    if raw[:4] != b"%PDF" or len(raw) < 10000:
        return {"id": tid, "filename": filename, "ok": False, "error": "not pdf", **chosen}
    dest.write_bytes(raw)
    # extract first pages text for KB
    try:
        from pypdf import PdfReader

        r = PdfReader(str(dest))
        text = "\n".join((p.extract_text() or "")[:2800] for p in r.pages[:5])
        (EXT / f"{tid}.txt").write_text(text, encoding="utf-8")
        n_pages = len(r.pages)
    except Exception:
        text = chosen.get("summary") or ""
        n_pages = None
        (EXT / f"{tid}.txt").write_text(text, encoding="utf-8")

    return {
        "id": tid,
        "filename": filename,
        "ok": True,
        "via": "arxiv",
        "bytes": len(raw),
        "hint": hint,
        "slides": slides,
        "arxiv_id": chosen.get("arxiv_id"),
        "title": chosen.get("title") or hint,
        "authors": chosen.get("authors") or [],
        "year": chosen.get("year"),
        "summary": (chosen.get("summary") or text)[:1100],
        "abs_url": chosen.get("abs_url"),
        "pages": n_pages,
    }


def main():
    results = []
    for t in TARGETS:
        if t[1] is None:
            continue
        rec = resolve_target(t)
        results.append(rec)
        print(json.dumps({k: rec.get(k) for k in ("id", "ok", "arxiv_id", "filename", "bytes", "error")}, ensure_ascii=False))
        time.sleep(0.5)
    MANIFEST.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    ok = sum(1 for r in results if r and r.get("ok"))
    print(f"\nDone {ok}/{len(results)} -> {MANIFEST}")


if __name__ == "__main__":
    main()
