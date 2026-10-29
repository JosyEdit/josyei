#!/usr/bin/env python3
"""Met à jour feed.xml, sitemap.xml, news-sitemap.xml et la liste /actualites/ à partir des articles publiés.

Relançable sans effet de bord : un fichier n'est réécrit que si son contenu change.
Bibliothèque standard uniquement. À lancer depuis n'importe où : python scripts/build_feeds.py
"""
import email.utils
import html
import os
import re
import subprocess
import sys
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path
from xml.dom import minidom

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://josyei.com"
CARTES_AUTO_DEPUIS = date(2026, 10, 26)  # cartes de /actualites/ gérées par ce script à partir de cette date
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
EMOJI = re.compile("^[\U0001F000-\U0001FAFF☀-➿️\\s]+")
REGLES = [("prénom", re.compile(r"Val[ée]ry", re.I)), ("prix", re.compile(r"\d[\d\s.,]*\s?€")),
          ("« garanti »", re.compile(r"\bgaranti", re.I)), ("« consultant »", re.compile(r"\bconsultante?s?\b", re.I)),
          ("« TPE/PME »", re.compile(r"TPE\s?/\s?PME|TPE et PME", re.I))]


def git(*args):
    return subprocess.run(["git", "-C", str(ROOT), *args], capture_output=True, text=True, encoding="utf-8").stdout.strip()


def ecrire_si_change(path, contenu):
    ancien = path.read_text(encoding="utf-8") if path.exists() else None
    if ancien != contenu:
        path.write_text(contenu, encoding="utf-8", newline="\n")
        print(f"mis à jour : {path.relative_to(ROOT).as_posix()}")
        return True
    return False


def meta(t, attr, nom):
    m = re.search(rf'<meta {attr}="{re.escape(nom)}" content="([^"]*)"', t)
    return html.unescape(m.group(1)) if m else ""


def indexable(t):
    return "noindex" not in t and 'http-equiv="refresh"' not in t


def date_creation(rel):
    # Pas de --follow : les articles sont copiés du même gabarit et git les confondrait (renommage détecté).
    dates = git("log", "--diff-filter=A", "--format=%aI", "--", rel).splitlines()
    return datetime.fromisoformat(dates[-1]) if dates else datetime.now(timezone.utc)


def date_modif(rel):
    d = git("log", "-1", "--format=%cs", "--", rel)
    return d or datetime.now(timezone.utc).date().isoformat()


def articles():
    res = []
    for f in sorted((ROOT / "actualites").glob("*/index.html")):
        t = f.read_text(encoding="utf-8")
        if not indexable(t):
            continue
        rel = f.relative_to(ROOT).as_posix()
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S)
        can = re.search(r'<link rel="canonical" href="([^"]+)"', t)
        if not (h1 and can):
            continue
        titre = EMOJI.sub("", html.unescape(re.sub(r"<[^>]+>", "", h1.group(1))).strip())
        emo = re.search(r'<h1[^>]*>\s*<span aria-hidden="true">([^<]+)</span>', t)
        corps = re.search(r"<main\b.*?</main>", t, re.S)
        res.append({"rel": rel, "url": can.group(1), "titre": titre, "emoji": emo.group(1) if emo else "📰",
                    "desc": meta(t, "name", "description"), "image": meta(t, "property", "og:image"),
                    "alt": meta(t, "property", "og:image:alt") or titre, "date": date_creation(rel),
                    "ordre": meta(t, "property", "article:published_time"),  # départage les articles d'un même commit
                    "texte": html.unescape(re.sub(r"<[^>]+>", " ", corps.group(0) if corps else t))})
    return sorted(res, key=lambda a: (a["date"], a["ordre"]), reverse=True)


def taille_image(url, anciennes):
    if url.startswith(SITE + "/"):
        f = ROOT / url[len(SITE) + 1:].split("?")[0]
        if f.is_file():
            return f.stat().st_size
    if url in anciennes:
        return anciennes[url]
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "josyei-feed"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return int(r.headers.get("Content-Length") or 0)
    except Exception:
        return 0


def type_image(url):
    u = url.lower()
    for ext, typ in ((".png", "image/png"), (".webp", "image/webp"), (".gif", "image/gif"), ("fm=png", "image/png"), ("fm=webp", "image/webp")):
        if ext in u:
            return typ
    return "image/jpeg"


def construire_flux(arts):
    path = ROOT / "feed.xml"
    anciennes = {}
    if path.exists():
        for m in re.finditer(r'<enclosure url="([^"]+)" length="(\d+)"', path.read_text(encoding="utf-8")):
            anciennes[html.unescape(m.group(1))] = int(m.group(2))
    dix = arts[:10]
    x = lambda s: html.escape(s, quote=True)
    xt = lambda s: html.escape(s, quote=False)
    items = []
    for a in dix:
        enc = ""
        if a["image"]:
            enc = f'\n      <enclosure url="{x(a["image"])}" length="{taille_image(a["image"], anciennes)}" type="{type_image(a["image"])}"/>'
        items.append(f"""    <item>
      <title>{xt(a["titre"])}</title>
      <link>{xt(a["url"])}</link>
      <guid isPermaLink="true">{xt(a["url"])}</guid>
      <description>{xt(a["desc"])}</description>
      <pubDate>{email.utils.format_datetime(a["date"])}</pubDate>{enc}
    </item>""")
    build = email.utils.format_datetime(dix[0]["date"]) if dix else email.utils.format_datetime(datetime.now(timezone.utc))
    xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JOSY EI - Média Tech &amp; Outils</title>
    <link>{SITE}/</link>
    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Analyses, guides et sélections d’outils : l’IA et l’automatisation décryptées sans jargon.</description>
    <language>fr</language>
    <lastBuildDate>{build}</lastBuildDate>
{chr(10).join(items)}
  </channel>
</rss>
"""
    minidom.parseString(xml.encode("utf-8"))
    return ecrire_si_change(path, xml)


def construire_sitemap():
    path = ROOT / "sitemap.xml"
    t = path.read_text(encoding="utf-8")
    presentes = set(re.findall(r"<loc>([^<]+)</loc>", t))
    ajouts = []
    for f in sorted(ROOT.rglob("index.html")):
        if ".git" in f.parts:
            continue
        rel = f.relative_to(ROOT).as_posix()
        if rel.split("/")[0] in ("merci",) or rel.startswith("404"):
            continue
        p = f.read_text(encoding="utf-8")
        can = re.search(r'<link rel="canonical" href="([^"]+)"', p)
        if not indexable(p) or not can or can.group(1) in presentes:
            continue
        if can.group(1) != SITE + "/" + rel[: -len("index.html")]:
            continue
        ajouts.append(f"  <url><loc>{can.group(1)}</loc><lastmod>{date_modif(rel)}</lastmod></url>")
    if not ajouts:
        return False
    t = t.replace("</urlset>", "\n".join(ajouts) + "\n</urlset>")
    minidom.parseString(t.encode("utf-8"))
    return ecrire_si_change(path, t)


def construire_news(arts):
    path = ROOT / "news-sitemap.xml"
    t = path.read_text(encoding="utf-8")
    presentes = set(re.findall(r"<loc>([^<]+)</loc>", t))
    x = lambda s: html.escape(s, quote=False)
    ajouts = [f"""  <url>
    <loc>{a["url"]}</loc>
    <news:news>
      <news:publication>
        <news:name>JOSY EI</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>{a["date"].isoformat()}</news:publication_date>
      <news:title>{x(a["titre"])}</news:title>
    </news:news>
  </url>""" for a in sorted(arts, key=lambda a: (a["date"], a["ordre"])) if a["url"] not in presentes]
    if not ajouts:
        return False
    t = t.replace("</urlset>", "\n".join(ajouts) + "\n</urlset>")
    minidom.parseString(t.encode("utf-8"))
    return ecrire_si_change(path, t)


def construire_liste(arts):
    path = ROOT / "actualites" / "index.html"
    t = path.read_text(encoding="utf-8")
    ancre = '<div class="digital-blog-grid">'
    assert ancre in t, "grille des articles introuvable dans actualites/index.html"
    x = lambda s: html.escape(s, quote=True)
    # Cartes ajoutées par ce script (articles du 26/10/2026 ou plus récents) : description alignée sur la page.
    # Les 12 cartes plus anciennes, écrites à la main, ne sont jamais modifiées.
    for a in arts:
        if a["date"].date() < CARTES_AUTO_DEPUIS or f'href="{a["url"]}"' not in t:
            continue
        carte = re.search(r'<article class="digital-card digital-blog-card"><a class="digital-blog-media" href="'
                          + re.escape(x(a["url"])) + r'".*?</article>', t, re.S)
        if carte:
            neuve = re.sub(r"(</h2><p>).*?(</p>)", lambda m: m.group(1) + html.escape(a["desc"], quote=False) + m.group(2),
                           carte.group(0), count=1, flags=re.S)
            t = t.replace(carte.group(0), neuve)
    nouveaux = [a for a in arts if f'href="{a["url"]}"' not in t]
    for a in sorted(nouveaux, key=lambda a: (a["date"], a["ordre"])):  # le plus récent finit en tête
        d = a["date"]
        carte = (f'<article class="digital-card digital-blog-card"><a class="digital-blog-media" href="{x(a["url"])}" '
                 f'aria-label="Lire : {x(a["titre"])}"><img src="{x(a["image"])}" alt="{x(a["alt"])}" loading="lazy" decoding="async"></a>'
                 f'<div class="digital-blog-card-body"><p class="actu-date"><time datetime="{d.date().isoformat()}">'
                 f'{d.day} {MOIS[d.month - 1]} {d.year}</time></p><h2><span aria-hidden="true">{a["emoji"]}</span> '
                 f'<a href="{x(a["url"])}">{html.escape(a["titre"], quote=False)}</a></h2><p>{html.escape(a["desc"], quote=False)}</p>'
                 f'<a class="digital-blog-link" href="{x(a["url"])}">Lire l’article</a></div></article>')
        t = t.replace(ancre, ancre + carte, 1)
    return ecrire_si_change(path, t), nouveaux


def construire_accueil(arts):
    """Les 6 derniers articles dans la section « Dernières actualités » de l'accueil."""
    path = ROOT / "index.html"
    t = path.read_text(encoding="utf-8")
    debut, fin = "<!-- derniers-articles -->", "<!-- /derniers-articles -->"
    if debut not in t or fin not in t:
        return False
    x = lambda s: html.escape(s, quote=True)
    cartes = []
    for a in arts[:6]:
        d = a["date"]
        cartes.append(f'        <article class="interactive-card"><p class="actu-date"><time datetime="{d.date().isoformat()}">'
                      f'{d.day} {MOIS[d.month - 1]} {d.year}</time></p><h3><a href="{x(a["url"])}">{html.escape(a["titre"], quote=False)}</a></h3>'
                      f'<p>{html.escape(a["desc"], quote=False)}</p></article>')
    i, j = t.index(debut) + len(debut), t.index(fin)
    return ecrire_si_change(path, t[:i] + "\n" + "\n".join(cartes) + "\n" + t[j:])


def controle_regles(arts):
    lignes = []
    for a in arts:
        trouves = [nom for nom, motif in REGLES if motif.search(a["texte"] + " " + a["desc"] + " " + a["titre"])]
        if trouves:
            lignes.append(f"- ⚠️ `{a['rel']}` : {', '.join(trouves)}")
    if lignes:
        texte = "### Contrôle des règles éditoriales (avertissement)\n" + "\n".join(lignes) + "\n"
        print(texte)
        resume = os.environ.get("GITHUB_STEP_SUMMARY")
        if resume:
            with open(resume, "a", encoding="utf-8") as f:
                f.write(texte)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    arts = articles()
    # « nouveaux » = articles pas encore listés dans news-sitemap.xml avant ce passage
    deja = set(re.findall(r"<loc>([^<]+)</loc>", (ROOT / "news-sitemap.xml").read_text(encoding="utf-8")))
    construire_flux(arts)
    construire_sitemap()
    construire_news(arts)
    construire_liste(arts)
    construire_accueil(arts)
    controle_regles([a for a in arts if a["url"] not in deja])
    print(f"{len(arts)} articles ; flux : {min(10, len(arts))} items")


if __name__ == "__main__":
    main()
