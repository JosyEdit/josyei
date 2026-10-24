import re
import shutil
import sys
import unicodedata
from datetime import datetime
from pathlib import Path

ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path.cwd()
BACKUP_DIR = ROOT / f"_backup_emoji_{datetime.now():%Y%m%d_%H%M%S}"
CSS_FILE = ROOT / "assets" / "site-enhancements.css"

EMOJI_RE = re.compile(
    "["
    "\U0001F000-\U0001FAFF"
    "\U00002600-\U000027BF"
    "\U0001F1E6-\U0001F1FF"
    "\U00002B00-\U00002BFF"
    "\U00002190-\U000021FF"
    "\U0000FE0F"
    "\U0000200D"
    "\U00002764"
    "\U0000270A-\U0000270D"
    "\U0001F900-\U0001F9FF"
    "]+"
)

TIMELINE_EMOJIS = {"comprendre": "", "tester": "", "transmettre": ""}
TECH_EMOJIS = {"google business profile": "", "google business": "", "google": "", "n8n": "", "wordpress": "", "whatsapp": "", "telegram": "", "signal": "", "facebook": "", "instagram": "", "linkedin": "", "twitter": "", "x": "", "youtube": "", "tiktok": "", "seo": "", "sea": "", "email": "", "emailing": "", "crm": "", "hubspot": "", "brevo": "", "mailchimp": "", "stripe": "", "paypal": "", "woocommerce": "", "shopify": "", "python": "", "powershell": "", "docker": "", "github": "", "git": "", "api": "", "webhook": "", "openai": "", "mistral": "", "qwen": "", "claude": "", "gemini": "", "ollama": "", "automatisation": "", "automation": "", "no-code": "", "low-code": "", "analytics": "", "ga4": "", "matomo": "", "search console": "", "elementor": "", "divi": "", "notion": "", "airtable": "", "google sheets": "", "excel": "", "zapier": "", "make": ""}
KEYWORD_EMOJIS = {"notre processus": "", "processus": "", "process": "", "methode": "", "méthode": "", "technologies": "", "technologie": "", "outils": "", "seo": "", "referencement": "", "référencement": "", "ia": "", "intelligence artificielle": "", "ai": "", "automatisation": "", "automation": "", "workflow": "", "crm": "", "client": "", "prospection": "", "prospects": "", "vente": "", "monetisation": "", "monétisation": "", "email": "", "emailing": "", "newsletter": "", "reseaux sociaux": "", "réseaux sociaux": "", "social": "", "site": "", "web": "", "wordpress": "", "contenu": "", "blog": "", "avis": "", "reputation": "", "réputation": "", "securite": "", "sécurité": "", "rgpd": "", "conformite": "", "conformité": "", "juridique": "", "veille": "", "contact": "", "prix": "", "offre": "", "service": "", "audit": "", "strategie": "", "stratégie": "", "performance": "", "visibilite": "", "visibilité": "", "trafic": "", "conversion": "", "statistiques": "", "temoignages": "", "témoignages": "", "faq": "", "equipe": "", "équipe": "", "portfolio": "", "realisations": "", "réalisations": ""}

TAG_STRIPPER = re.compile(r"<[^>]*>")

def normalize_text(value):
    value = unicodedata.normalize("NFKD", value)
    value = "".join(ch for ch in value if not unicodedata.combining(ch))
    value = value.lower()
    value = re.sub(r"\s+", " ", value)
    return value.strip()

TIMELINE_ITEMS = sorted(((normalize_text(k), v) for k, v in TIMELINE_EMOJIS.items()), key=lambda item: len(item[0]), reverse=True)
TECH_ITEMS = sorted(((normalize_text(k), v) for k, v in TECH_EMOJIS.items()), key=lambda item: len(item[0]), reverse=True)
KEYWORD_ITEMS = sorted(((normalize_text(k), v) for k, v in KEYWORD_EMOJIS.items()), key=lambda item: len(item[0]), reverse=True)

def visible_text(html_fragment): return normalize_text(TAG_STRIPPER.sub(" ", html_fragment))
def has_emoji(html_fragment): return bool(EMOJI_RE.search(TAG_STRIPPER.sub(" ", html_fragment)))

def prepend_emoji(inner_html, emoji):
    if not inner_html.strip(): return inner_html
    if re.match(r"^\s*[^<\s]", inner_html):
        return re.sub(r"^(\s*)", lambda m: f"{m.group(1)}{emoji} ", inner_html, count=1)
    return re.sub(r"((?:<[^>]*>)*)(\s*)([^<])", lambda m: f"{m.group(1)}{m.group(2)}{emoji} {m.group(3)}", inner_html, count=1)

H2_RE = re.compile(r"(<h2\b[^>]*>)(.*?)(</h2>)", re.I | re.S)
H3_RE = re.compile(r"(<h3\b[^>]*>)(.*?)(</h3>)", re.I | re.S)
TECH_PILL_RE = re.compile(r'''(<span\b(?=[^>]*\bclass\s*=\s*(?:"[^"]*\btech-pill\b[^"]*"|'[^']*\btech-pill\b[^']*'|[^\s>]*\btech-pill\b[^\s>]*))[^>]*>)(.*?)(</span>)''', re.I | re.S)

def choose_heading_emoji(text, tag):
    if tag == "h3":
        for key, emoji in TIMELINE_ITEMS:
            if key and (text == key or text.startswith(key)): return emoji
    for key, emoji in KEYWORD_ITEMS:
        if key and key in text: return emoji
    return None

def process_heading(match, tag):
    opening, inner, closing = match.groups()
    if has_emoji(inner): return match.group(0)
    text = visible_text(inner)
    if not text: return match.group(0)
    emoji = choose_heading_emoji(text, tag)
    if not emoji: return match.group(0)
    new_inner = prepend_emoji(inner, emoji)
    return match.group(0) if new_inner == inner else f"{opening}{new_inner}{closing}"

def process_tech_pill(match):
    opening, inner, closing = match.groups()
    if has_emoji(inner): return match.group(0)
    text = visible_text(inner)
    if not text: return match.group(0)
    for key, emoji in TECH_ITEMS:
        if key and (text == key or key in text):
            new_inner = prepend_emoji(inner, emoji)
            if new_inner != inner: return f"{opening}{new_inner}{closing}"
            break
    return match.group(0)

def read_text_best_effort(path):
    raw = path.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try: return raw.decode(enc), enc
        except UnicodeDecodeError: pass
    return raw.decode("utf-8", errors="replace"), "utf-8"

def write_text_utf(path, content, original_encoding="utf-8"):
    enc = "utf-8-sig" if original_encoding == "utf-8-sig" else "utf-8"
    path.write_text(content, encoding=enc, newline="")

def backup_file(path):
    try: rel = path.relative_to(ROOT)
    except ValueError: rel = Path(path.name)
    target = BACKUP_DIR / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, target)

def process_html_file(path):
    content, enc = read_text_best_effort(path)
    new_content = H2_RE.sub(lambda m: process_heading(m, "h2"), content)
    new_content = H3_RE.sub(lambda m: process_heading(m, "h3"), new_content)
    new_content = TECH_PILL_RE.sub(process_tech_pill, new_content)
    if new_content == content: return False
    backup_file(path)
    write_text_utf(path, new_content, enc)
    return True

CSS_START = "/* JOSY-EI hover enhancements:start */"
CSS_END = "/* JOSY-EI hover enhancements:end */"
CSS_BLOCK = f"""{CSS_START}
.timeline-step {{ transition: transform .25s ease, box-shadow .25s ease; }}
.timeline-step:hover {{ transform: translateY(-3px); box-shadow: 0 12px 28px rgba(96, 165, 250, .28); }}
.tech-pill {{ transition: transform .2s ease, box-shadow .2s ease, filter .2s ease; cursor: default; }}
.tech-pill:hover {{ transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 18px rgba(96, 165, 250, .30); filter: brightness(1.08); }}
{CSS_END}"""

def process_css():
    CSS_FILE.parent.mkdir(parents=True, exist_ok=True)
    if CSS_FILE.exists(): content, enc = read_text_best_effort(CSS_FILE)
    else: content, enc = "", "utf-8"
    pattern = re.compile(re.escape(CSS_START) + r".*?" + re.escape(CSS_END), re.I | re.S)
    if pattern.search(content):
        new_content = pattern.sub(lambda m: CSS_BLOCK, content, count=1)
        action = "updated"
    else:
        new_content = content.rstrip() + "\n\n" + CSS_BLOCK + "\n" if content.strip() else CSS_BLOCK + "\n"
        action = "added"
    if new_content == content: return "unchanged"
    if CSS_FILE.exists(): backup_file(CSS_FILE)
    write_text_utf(CSS_FILE, new_content, enc)
    return action

def main():
    if not ROOT.exists():
        print(f" Dossier introuvable: {ROOT}")
        return 1
    html_files = sorted(ROOT.rglob("*.html"))
    modified_files = []
    for html_file in html_files:
        try:
            if process_html_file(html_file): modified_files.append(html_file)
        except Exception as exc: print(f" Erreur dans {html_file}: {exc}")
    css_action = process_css()
    print(f"Dossier analysé: {ROOT}")
    print(f"Fichiers HTML modifiés: {len(modified_files)}")
    for file_path in modified_files:
        try: print(f" - {file_path.relative_to(ROOT)}")
        except ValueError: print(f" - {file_path}")
    print(f"CSS: {css_action} -> {CSS_FILE}")
    if BACKUP_DIR.exists(): print(f"Backup: {BACKUP_DIR}")
    else: print("Aucune sauvegarde créée (aucun fichier modifié).")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
