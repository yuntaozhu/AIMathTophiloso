#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json, os, re, time
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(r"F:/project/AIMathTophiloso")
PDF = ROOT / "PDF"
EXT = PDF / "_extracted"
EXT.mkdir(exist_ok=True)

for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
    if line.startswith("FIRECRAWL_API_KEY="):
        KEY = line.split("=", 1)[1].strip().strip('"')
        break


def fc(path, payload, timeout=120):
    data = json.dumps(payload).encode()
    req = Request(
        f"https://api.firecrawl.dev/v1/{path}",
        data=data,
        method="POST",
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    with urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())


def get(url, timeout=120):
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=timeout) as r:
        return r.read()


def try_save_pdf(urls, dest: Path):
    for u in urls:
        if not u:
            continue
        try:
            raw = get(u)
            if raw[:4] == b"%PDF" and len(raw) > 20000:
                dest.write_bytes(raw)
                print(f"SAVED {dest.name} {len(raw)} <- {u}")
                return True
            print(f"not pdf {u} size={len(raw)}")
        except Exception as e:
            print(f"fail {u}: {e}")
    return False


print("=== shiu ===")
sr = fc(
    "search",
    {
        "query": "A Drosophila computational brain model reveals sensorimotor processing Shiu pdf",
        "limit": 8,
    },
)
urls = [d.get("url") for d in (sr.get("data") or [])]
print("hits", urls)
try_save_pdf(
    urls
    + [
        "https://www.nature.com/articles/s41586-024-07763-9.pdf",
        "https://www.biorxiv.org/content/10.1101/2023.06.27.546680v2.full.pdf",
        "https://www.biorxiv.org/content/10.1101/2023.06.27.546680v1.full.pdf",
    ],
    PDF / "Shiu_et_al_A_Drosophila_computational_brain_model_Nature_2024.pdf",
)

print("=== friedman ===")
sr = fc(
    "search",
    {
        "query": "Concrete Mathematical Incompleteness Harvey Friedman pdf",
        "limit": 8,
    },
)
urls = [d.get("url") for d in (sr.get("data") or [])]
print("hits", urls)
page = fc(
    "scrape",
    {
        "url": "https://u.osu.edu/friedman.8/foundational-adventures/downloadable-manuscripts/",
        "formats": ["links", "markdown"],
        "onlyMainContent": True,
    },
)
links = (page.get("data") or {}).get("links") or []
md = (page.get("data") or {}).get("markdown") or ""
pdf_links = [l for l in links if isinstance(l, str) and ".pdf" in l.lower()]
pdf_links += re.findall(r"https?://[^\s)\"']+\.pdf", md, flags=re.I)
print("pdf_links sample", pdf_links[:20])
ranked = sorted(
    set(pdf_links),
    key=lambda u: (
        0
        if re.search(r"incomplet|boolean|cube|BRT|concrete|Finite|Combinatorial", u, re.I)
        else 1,
        len(u),
    ),
)
try_save_pdf(ranked[:12] + urls, PDF / "Friedman_Concrete_Mathematical_Incompleteness.pdf")

print("=== blogs ===")
for query, md_name in [
    (
        "site:martinfowler.com Harness engineering for coding agent users",
        "Boeckeler_Harness_engineering_for_coding_agent_users.md",
    ),
    (
        "DeepMind AlphaProof silver-medal International Mathematical Olympiad",
        "DeepMind_AI_achieves_silver_medal_standard_IMO_AlphaProof.md",
    ),
]:
    sr = fc("search", {"query": query, "limit": 5})
    data = sr.get("data") or []
    url = None
    for d in data:
        u = d.get("url") or ""
        if any(x in u for x in ("martinfowler", "deepmind", "blog.google")):
            url = u
            break
    if not url and data:
        url = data[0].get("url")
    print(md_name, "->", url)
    if not url:
        continue
    sc = fc("scrape", {"url": url, "formats": ["markdown"], "onlyMainContent": True})
    body = (sc.get("data") or {}).get("markdown") or ""
    if len(body) > 400:
        (EXT / md_name).write_text(f"Source: {url}\n\n{body}", encoding="utf-8")
        print("saved", md_name, len(body))
    time.sleep(1)

print("=== original BKM 1984 ===")
sr = fc(
    "search",
    {
        "query": 'Beale Kato Majda "Remarks on the breakdown of smooth solutions" 1984 pdf',
        "limit": 6,
    },
)
for d in sr.get("data") or []:
    print(" ", d.get("url"))
try_save_pdf(
    [d.get("url") for d in (sr.get("data") or [])]
    + ["https://link.springer.com/content/pdf/10.1007/BF01212349.pdf"],
    PDF / "Beale_Kato_Majda_1984_original_CMP.pdf",
)

print("done")
