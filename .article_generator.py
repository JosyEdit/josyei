from html.parser import HTMLParser
from pathlib import Path
import html
import json
import re


class ArticleWords(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "article":
            self.depth += 1

    def handle_endtag(self, tag):
        if tag == "article" and self.depth:
            self.depth -= 1

    def handle_data(self, data):
        if self.depth:
            self.parts.append(data)


def write_articles(root, articles):
    listing = (root / "actualites" / "index.html").read_text(encoding="utf-8")
    style = re.search(r"<style>\s*html,body[\s\S]*?</style>", listing, re.I)
    header = re.search(r"<header\b[\s\S]*?</header>", listing, re.I)
    footer = re.search(r"<footer\b[\s\S]*?</footer>", listing, re.I)
    if not all((style, header, footer)):
        raise RuntimeError("Gabarit d’article incomplet")

    for article in articles:
        canonical = "https://josyei.com/actualites/" + article["slug"] + "/"
        sections = []
        for heading, explanation, action in article["sections"]:
            method = (
                f"Commencez par {action}. Définissez le résultat attendu, "
                "la personne qui le vérifie et les exceptions qui restent "
                "manuelles. Testez sur un exemple représentatif, notez les "
                "corrections, puis ajustez avant d’élargir. Cette étape rend "
                "la démarche lisible, mesurable et réversible."
            )
            items = f"<li>Documenter {html.escape(action)} et le résultat de la vérification.</li>"
            sections.append(
                f"<section class=\"digital-reveal\"><h2>{html.escape(heading)}</h2>"
                f"<p>{html.escape(explanation)}</p><h3>Passer à la pratique</h3>"
                f"<p>{html.escape(method)}</p><ul>{items}</ul></section>"
            )

        faq = "".join(
            f"<details><summary>{html.escape(question)}</summary>"
            f"<p>{html.escape(answer)}</p></details>"
            for question, answer in article["faq"]
        )
        content = (
            f"<section class=\"pg-hero\"><div class=\"w\">"
            f"<p class=\"digital-lead\">Guides pratiques · Activité en ligne</p>"
            f"<h1 id=\"jx-h1\">{html.escape(article['title'])}</h1>"
            f"<p class=\"sub\">{html.escape(article['meta'])}</p></div></section>"
            f"<section class=\"pg-corps\"><div class=\"w\"><article "
            f"class=\"digital-article\" aria-labelledby=\"jx-h1\">"
            f"<p>{html.escape(article['intro'])}</p>"
            f"<figure class=\"digital-image\"><img src=\"/{article['image']}\" "
            f"alt=\"{html.escape(article['alt'])}\" width=\"640\" height=\"640\" "
            f"loading=\"lazy\" decoding=\"async\"></figure>"
            f"{''.join(sections)}"
            f"<section class=\"digital-reveal\"><h2>Questions fréquentes</h2>"
            f"<div class=\"digital-faq\">{faq}</div></section>"
            f"<section class=\"digital-reveal\"><h2>À retenir</h2>"
            f"<p>{html.escape(article['conclusion'])}</p>"
            "</section>"
            "</article></div></section>"
            f"<section class=\"pg-cta\"><div class=\"w\"><div class=\"pg-cta-carte\">"
            f"<h2>Approfondir le sujet</h2><p>Découvrez notre approche de "
            f"{html.escape(article['service_label'])} et les repères pour cadrer "
            f"votre besoin.</p><a class=\"btn btn-p pg-gros\" "
            f"href=\"{article['service']}\">Découvrir le service</a>"
            "</div></div></section>"
        )
        counter = ArticleWords()
        counter.feed(content)
        count = len(re.findall(r"\b[\wÀ-ÿ’'-]+\b", " ".join(counter.parts)))
        if not 800 <= count <= 1000:
            raise RuntimeError(f"{article['slug']}: {count} mots (attendu: 800–1000)")

        image_url = "https://josyei.com/" + article["image"]
        description = html.escape(article["meta"], quote=True)
        title = html.escape(article["title"], quote=True)
        image_alt = html.escape(article["alt"], quote=True)
        schema = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": article["title"],
            "description": article["meta"],
            "image": [image_url],
            "datePublished": "2026-10-23T00:00:00+02:00",
            "dateModified": "2026-10-23T00:00:00+02:00",
            "mainEntityOfPage": canonical,
            "publisher": {
                "@type": "Organization",
                "name": "JOSY EI",
                "url": "https://josyei.com/",
            },
            "inLanguage": "fr-FR",
        }
        document = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} | JOSY EI</title>
<meta name="description" content="{description}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="article">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{image_url}">
<meta property="og:image:alt" content="{image_alt}">
<meta property="article:published_time" content="2026-10-23T00:00:00+02:00">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{image_url}">
<link rel="stylesheet" href="/assets/site-enhancements.css">
<link rel="icon" href="/favicon.ico" sizes="any">
<style>body{{margin:0;background:#0a0e27}}</style>
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
</head>
<body>
{style.group()}
<div class="jx alignfull">
{header.group()}
{content}
{footer.group()}
</div>
<script src="/assets/site-enhancements.js" defer></script>
</body>
</html>
"""
        path = root / "actualites" / article["slug"] / "index.html"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(document, encoding="utf-8", newline="")
        print(article["slug"], count)
