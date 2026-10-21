"""Создаёт печатный PDF из того же макета, что и редактируемый PowerPoint."""
import json
from pathlib import Path
import fitz
from reportlab.pdfgen.canvas import Canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
layout = json.loads((ROOT / 'source/layout.json').read_text(encoding='utf-8'))
pdfmetrics.registerFont(TTFont('SegoeUI', 'C:/Windows/Fonts/segoeui.ttf'))
pdfmetrics.registerFont(TTFont('SegoeUI-Bold', 'C:/Windows/Fonts/segoeuib.ttf'))
scale = 72 / 96
width, height = layout['width'] * scale, layout['height'] * scale
output = ROOT / 'output/OPO-A5-review.pdf'
canvas = Canvas(str(output), pagesize=(width, height))
canvas.setTitle('НПИ «Недра» и Ресурс-Плюс — предложение для предприятий ОПО')
canvas.setAuthor('НПИ «Недра» / Ресурс-Плюс')
for elements in layout['pages']:
    for item in elements:
        x, top, w, h = [item[key] * scale for key in ('x', 'y', 'w', 'h')]
        if item['kind'] == 'image':
            asset = ROOT / 'assets' / item['name']
            canvas.saveState()
            clip = canvas.beginPath()
            clip.rect(x, height - top - h, w, h)
            canvas.clipPath(clip, stroke=0, fill=0)
            reader = ImageReader(str(asset))
            iw, ih = reader.getSize()
            ratio = max(w / iw, h / ih) if 'anime' in item['name'] else min(w / iw, h / ih)
            rw, rh = iw * ratio, ih * ratio
            canvas.drawImage(reader, x + (w-rw)/2, height-top-h+(h-rh)/2, width=rw, height=rh, mask='auto')
            canvas.restoreState()
            if item['name'].startswith('qr-'):
                url = 'https://nedra-npi.ru' if 'nedra' in item['name'] else 'https://plus-resurs.com'
                canvas.linkURL(url, (x, height-top-h, x+w, height-top), relative=0)
            continue
        font = 'SegoeUI-Bold' if item['bold'] else 'SegoeUI'
        size = item['size'] * scale
        canvas.setFont(font, size)
        canvas.setFillColor(HexColor(item['color']))
        for index, line in enumerate(item['value'].split('\n')):
            measured = pdfmetrics.stringWidth(line, font, size)
            if measured > w + 0.5:
                raise ValueError(f'Слишком длинная строка: {line} ({measured:.1f} > {w:.1f})')
            baseline = height - top - size * 0.94 - index * size * 1.28
            if item['align'] == 'right':
                canvas.drawRightString(x+w, baseline, line)
            else:
                canvas.drawString(x, baseline, line)
    canvas.showPage()
canvas.save()
doc = fitz.open(output)
for index, page in enumerate(doc):
    page.get_pixmap(matrix=fitz.Matrix(2, 2)).save(ROOT / 'output' / f'OPO-preview-{index+1}.png')
    assert abs(page.rect.width - 148/25.4*72) < 0.1
    assert abs(page.rect.height - 210/25.4*72) < 0.1
print('PDF: 2 страницы A5, шрифты встроены, текст проверен, превью сохранены')
