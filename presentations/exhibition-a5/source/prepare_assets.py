"""Копирует фирменные материалы и создаёт QR-коды для печати."""
from pathlib import Path
import re
import shutil
import qrcode

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
REPOS = Path("C:/Users/alex/Documents/GitHub")
shutil.copy2(REPOS / "nedra/frontend/public/logo.svg", ASSETS / "nedra.svg")
shutil.copy2(REPOS / "nedra/frontend/public/block_2.jpg", ASSETS / "industry.jpg")
source = (REPOS / "agregator/frontend/src/shared/ui/icons/logo-icon/index.tsx").read_text(encoding="utf-8")
svg = source[source.index("<svg"):source.index("</svg>") + 6]
svg = re.sub(r'\s+(className|aria-label)=\{[^\n]*\}', '', svg)
svg = svg.replace('{title && <title>{title}</title>}', '')
svg = svg.replace('currentColor', '#182B3A').replace('var(--color-orange-primary)', '#FF8A00')
for attr in ['clipPath', 'fillRule', 'clipRule', 'strokeWidth', 'stopColor', 'stopOpacity']:
    kebab = re.sub(r'([A-Z])', lambda match: '-' + match[1].lower(), attr)
    svg = svg.replace(attr + '=', kebab + '=')
(ASSETS / 'resurs.svg').write_text(svg, encoding='utf-8')
for name, url in [('nedra', 'https://nedra-npi.ru'), ('resurs', 'https://plus-resurs.com')]:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=16, border=4)
    qr.add_data(url)
    qr.make(fit=True)
    qr.make_image(fill_color='black', back_color='white').save(ASSETS / f'qr-{name}.png')
print('Оригинальные логотипы, фотография и два QR-кода подготовлены')
