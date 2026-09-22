#!/usr/bin/env python3
"""Search (Firecrawl) + download PPT-related open PDFs into PDF/."""
from __future__ import annotations

import base64
import json
import os
import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
PDF_DIR = ROOT / "PDF"
PDF_DIR.mkdir(exist_ok=True)
MANIFEST = PDF_DIR / "_fetched_manifest.json"

# Load .env FIRECRAWL_API_KEY
env_path = ROOT / ".env"
if env_path.exists():
    for line in env_path.read_text(encoding="utf-8").splitlines():
        if line.strip().startswith("FIRECRAWL_API_KEY="):
            os.environ.setdefault("FIRECRAWL_API_KEY", line.split("=", 1)[1].strip().strip('"'))

API_KEY = os.environ.get("FIRECRAWL_API_KEY", "").strip()
if not API_KEY:
    print("MISSING FIRECRAWL_API_KEY", file=sys.stderr)
    sys.exit(1)

FC_SEARCH = "https://api.firecrawl.dev/v1/search"
FC_SCRAPE = "https://api.firecrawl.dev/v1/scrape"

# Papers referenced by seminar slides / framing / KB but not yet as local PDF
TARGETS = [
    {
        "id": "generative-agents",
        "filename": "Generative_Agents_Interactive_Simulacra_of_Human_Behavior.pdf",
        "queries": [
            "Generative Agents Interactive Simulacra of Human Behavior Park filetype:pdf",
            "arxiv Generative Agents Interactive Simulacra Park 2304.03442",
        ],
        "prefer": [
            "https://arxiv.org/pdf/2304.03442.pdf",
            "arxiv.org/pdf/2304.03442",
        ],
    },
    {
        "id": "leandojo",
        "filename": "LeanDojo_Theorem_Proving_with_Retrieval_Augmented_Language_Models.pdf",
        "queries": [
            "LeanDojo Theorem Proving with Retrieval-Augmented Language Models arxiv pdf",
            "LeanDojo Yang Anandkumar filetype:pdf",
        ],
        "prefer": ["https://arxiv.org/pdf/2306.15626.pdf", "arxiv.org/pdf/2306.15626"],
    },
    {
        "id": "alphageometry",
        "filename": "Solving_Olympiad_Geometry_without_Human_Demonstrations_AlphaGeometry.pdf",
        "queries": [
            "Solving Olympiad Geometry without Human Demonstrations AlphaGeometry pdf arxiv",
            "AlphaGeometry Trinh Nature 2024 pdf",
        ],
        "prefer": ["arxiv.org/pdf/"],
    },
    {
        "id": "deepseek-prover",
        "filename": "DeepSeek_Prover_v1_5_Harnessing_Proof_Assistant_Feedback.pdf",
        "queries": [
            "DeepSeek-Prover-V1.5 Harnessing Proof Assistant Feedback arxiv pdf",
        ],
        "prefer": ["https://arxiv.org/pdf/2408.08152.pdf", "arxiv.org/pdf/2408.08152"],
    },
    {
        "id": "goedel-prover",
        "filename": "Goedel_Prover_A_Frontier_Model_for_Open_Source_Automated_Theorem_Proving.pdf",
        "queries": [
            "Goedel-Prover Frontier Model Open-Source Automated Theorem Proving arxiv pdf",
        ],
        "prefer": ["arxiv.org/pdf/"],
    },
    {
        "id": "beale-kato-majda",
        "filename": "Beale_Kato_Majda_Remarks_on_breakdown_of_smooth_solutions_Euler.pdf",
        "queries": [
            "Beale Kato Majda Remarks on the breakdown of smooth solutions for the 3-D Euler pdf",
            "Beale Kato Majda 1984 Commun Math Phys pdf",
        ],
        "prefer": [],
    },
    {
        "id": "shiu-flywire",
        "filename": "Shiu_et_al_A_Drosophila_computational_brain_model_Nature_2024.pdf",
        "queries": [
            "A Drosophila computational brain model reveals sensorimotor processing Shiu Nature 2024 pdf",
            "site:nature.com Drosophila computational brain model Shiu pdf",
        ],
        "prefer": ["nature.com", "biorxiv.org", "arxiv.org"],
    },
    {
        "id": "friedman-concrete",
        "filename": "Friedman_Concrete_Mathematical_Incompleteness.pdf",
        "queries": [
            "Harvey Friedman Concrete Mathematical Incompleteness pdf",
            "Friedman Boolean Relation Theory incompleteness pdf site:osu.edu",
        ],
        "prefer": ["u.osu.edu", "math.osu.edu", "philpapers.org"],
    },
    {
        "id": "cordoba-cascade",
        "filename": "Cordoba_Martinez_Zoroa_infinite_cascade_blowup.pdf",
        "queries": [
            "Córdoba Martínez-Zoroa infinite cascade blowup Euler forcing pdf arxiv",
            "Diego Cordoba Luis Martinez-Zoroa blow-up smooth forcing arxiv",
        ],
        "prefer": ["arxiv.org/pdf/"],
    },
    {
        "id": "harness-boeckeler",
        "filename": "Boeckeler_Harness_engineering_for_coding_agent_users.pdf",
        "queries": [
            "Harness engineering for coding agent users Birgitta Böckeler martinfowler",
            "site:martinfowler.com Harness engineering for coding agent users",
        ],
        "prefer": ["martinfowler.com"],
        "allow_html_to_pdf": True,
    },
    {
        "id": "alphaproof-imo",
        "filename": "DeepMind_AI_achieves_silver_medal_standard_IMO_AlphaProof.pdf",
        "queries": [
            "AI achieves silver-medal standard solving International Mathematical Olympiad AlphaProof DeepMind",
            "AlphaProof AlphaGeometry IMO DeepMind blog",
        ],
        "prefer": ["deepmind.google", "blog.google"],
        "allow_html_to_pdf": True,
    },
]


def http_json(url: str, payload: dict, timeout: int = 120) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "AIMathTophiloso-fetcher/1.0",
        },
        method="POST",
    )
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download_bytes(url: str, timeout: int = 120) -> bytes:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0 AIMathTophiloso/1.0"})
    with urlopen(req, timeout=timeout) as resp:
        return resp.read()


def normalize_arxiv_pdf(url: str) -> str | None:
    m = re.search(r"arxiv\.org/(?:pdf|abs|html)/(\d{4}\.\d{4,5})(v\d+)?", url)
    if m:
        return f"https://arxiv.org/pdf/{m.group(1)}.pdf"
    return None


def looks_like_pdf_url(url: str) -> bool:
    u = url.lower().split("?")[0]
    return u.endswith(".pdf") or "/pdf/" in u or "arxiv.org/pdf/" in u


def firecrawl_search(query: str, limit: int = 8) -> list[dict]:
    try:
        res = http_json(
            FC_SEARCH,
            {
                "query": query,
                "limit": limit,
                "lang": "en",
                "country": "us",
            },
            timeout=90,
        )
    except Exception as e:
        print(f"  search error: {e}")
        return []
    data = res.get("data") or res.get("web") or []
    if isinstance(data, dict):
        data = data.get("web") or data.get("results") or []
    return data if isinstance(data, list) else []


def pick_url(target: dict, results: list[dict]) -> str | None:
    prefers = target.get("prefer") or []
    urls = []
    for r in results:
        url = r.get("url") or r.get("link") or ""
        if url:
            urls.append(url)
            arx = normalize_arxiv_pdf(url)
            if arx:
                urls.append(arx)
    # prefer list first
    for pref in prefers:
        for u in urls:
            if pref in u:
                if "arxiv.org" in u and "/abs/" in u:
                    return normalize_arxiv_pdf(u) or u
                return u
    for u in urls:
        if looks_like_pdf_url(u):
            return normalize_arxiv_pdf(u) or u
    return urls[0] if urls else None


def scrape_pdf_base64(url: str) -> bytes | None:
    """Ask Firecrawl for raw PDF bytes (parsers empty)."""
    try:
        res = http_json(
            FC_SCRAPE,
            {
                "url": url,
                "formats": ["rawHtml"],
                "parsers": [],
                "timeout": 120000,
            },
            timeout=180,
        )
    except Exception as e:
        print(f"  scrape error: {e}")
        return None
    data = res.get("data") or {}
    # Some versions return pdf as base64 in metadata or content
    for key in ("pdf", "raw", "content"):
        val = data.get(key)
        if isinstance(val, str) and val.startswith("%PDF"):
            return val.encode("latin1", errors="ignore")
        if isinstance(val, str) and len(val) > 1000 and not val.lstrip().startswith("<"):
            try:
                raw = base64.b64decode(val)
                if raw[:4] == b"%PDF":
                    return raw
            except Exception:
                pass
    meta = data.get("metadata") or {}
    b64 = meta.get("pdf") or meta.get("contentBase64")
    if isinstance(b64, str):
        try:
            raw = base64.b64decode(b64)
            if raw[:4] == b"%PDF":
                return raw
        except Exception:
            pass
    return None


def scrape_markdown(url: str) -> str | None:
    try:
        res = http_json(
            FC_SCRAPE,
            {"url": url, "formats": ["markdown"], "onlyMainContent": True, "timeout": 90000},
            timeout=120,
        )
    except Exception as e:
        print(f"  md scrape error: {e}")
        return None
    data = res.get("data") or {}
    md = data.get("markdown")
    return md if isinstance(md, str) and len(md) > 200 else None


def markdown_to_simple_pdf(text: str, title: str) -> bytes:
    """Minimal PDF writer (text only) without external deps."""
    # Escape PDF special chars
    def esc(s: str) -> str:
        return s.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")

    lines = []
    for para in text.replace("\r", "").split("\n"):
        para = para.strip()
        if not para:
            lines.append("")
            continue
        # wrap ~90 chars
        while len(para) > 90:
            lines.append(para[:90])
            para = para[90:]
        lines.append(para)
    lines = lines[:220]  # keep short

    content_lines = ["BT", "/F1 10 Tf", "50 780 Td", "12 TL"]
    first = True
    for line in lines:
        safe = esc(line[:120])
        if first:
            content_lines.append(f"({safe}) Tj")
            first = False
        else:
            content_lines.append("T*")
            content_lines.append(f"({safe}) Tj")
    content_lines.append("ET")
    stream = "\n".join(content_lines).encode("latin-1", errors="replace")

    objs = []
    objs.append(b"1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n")
    objs.append(b"2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n")
    objs.append(
        b"3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj\n"
    )
    objs.append(
        f"4 0 obj<< /Length {len(stream)} >>stream\n".encode() + stream + b"\nendstream\nendobj\n"
    )
    objs.append(b"5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj\n")

    out = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for obj in objs:
        offsets.append(len(out))
        out.extend(obj)
    xref_pos = len(out)
    out.extend(f"xref\n0 {len(offsets)}\n".encode())
    out.extend(b"0000000000 65535 f \n")
    for off in offsets[1:]:
        out.extend(f"{off:010d} 00000 n \n".encode())
    out.extend(
        f"trailer<< /Size {len(offsets)} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n".encode()
    )
    return bytes(out)


def save_pdf(path: Path, raw: bytes) -> bool:
    if not raw or len(raw) < 1000:
        return False
    if raw[:4] != b"%PDF":
        # might still be valid if BOM etc.
        if b"%PDF" not in raw[:1000]:
            return False
    path.write_bytes(raw)
    return True


def fetch_one(target: dict) -> dict:
    out_path = PDF_DIR / target["filename"]
    result = {"id": target["id"], "filename": target["filename"], "ok": False, "url": None, "bytes": 0, "via": None}
    if out_path.exists() and out_path.stat().st_size > 5000:
        result.update(ok=True, bytes=out_path.stat().st_size, via="already_present")
        print(f"[SKIP] {target['id']} already exists ({result['bytes']} bytes)")
        return result

    # try known prefer absolute URLs first
    for pref in target.get("prefer") or []:
        if pref.startswith("http"):
            print(f"[DIRECT] {pref}")
            try:
                raw = download_bytes(pref if pref.endswith(".pdf") or "/pdf/" in pref else pref)
                if save_pdf(out_path, raw):
                    result.update(ok=True, url=pref, bytes=len(raw), via="prefer_direct")
                    print(f"  saved {out_path.name} ({len(raw)} bytes)")
                    return result
            except Exception as e:
                print(f"  prefer fail: {e}")

    candidates: list[str] = []
    for q in target["queries"]:
        print(f"[SEARCH] {target['id']}: {q}")
        results = firecrawl_search(q)
        time.sleep(1.2)
        url = pick_url(target, results)
        if url:
            candidates.append(url)
            print(f"  candidate: {url}")
        # also collect all arxiv
        for r in results:
            u = r.get("url") or ""
            arx = normalize_arxiv_pdf(u)
            if arx:
                candidates.append(arx)

    # dedupe
    seen = set()
    ordered = []
    for u in candidates:
        if u not in seen:
            seen.add(u)
            ordered.append(u)

    for url in ordered:
        print(f"[GET] {url}")
        # direct download for pdf urls
        if looks_like_pdf_url(url) or "arxiv.org/pdf/" in url:
            try:
                raw = download_bytes(url)
                if save_pdf(out_path, raw):
                    result.update(ok=True, url=url, bytes=len(raw), via="direct")
                    print(f"  saved {out_path.name} ({len(raw)} bytes)")
                    return result
            except Exception as e:
                print(f"  direct fail: {e}")
            raw = scrape_pdf_base64(url)
            if raw and save_pdf(out_path, raw):
                result.update(ok=True, url=url, bytes=len(raw), via="firecrawl_pdf")
                print(f"  saved via firecrawl ({len(raw)} bytes)")
                return result

        if target.get("allow_html_to_pdf"):
            md = scrape_markdown(url)
            if md:
                raw = markdown_to_simple_pdf(f"{target['filename']}\nSource: {url}\n\n{md}", target["id"])
                # also keep markdown sidecar
                (PDF_DIR / "_extracted" / f"{target['id']}.md").parent.mkdir(exist_ok=True)
                (PDF_DIR / "_extracted" / f"{target['id']}.md").write_text(md, encoding="utf-8")
                if save_pdf(out_path, raw):
                    result.update(ok=True, url=url, bytes=len(raw), via="html_markdown_pdf")
                    print(f"  saved html→pdf ({len(raw)} bytes)")
                    return result
        time.sleep(0.8)

    print(f"[FAIL] {target['id']}")
    return result


def main() -> None:
    manifest = []
    for t in TARGETS:
        manifest.append(fetch_one(t))
        time.sleep(0.5)
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    ok = sum(1 for m in manifest if m["ok"])
    print(f"\nDone: {ok}/{len(manifest)} ok. Manifest → {MANIFEST}")


if __name__ == "__main__":
    main()
