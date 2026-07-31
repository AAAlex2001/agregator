from __future__ import annotations

from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "tmp" / "imagegen" / "resurs-plus-comic-background.png"
QR_SOURCE = ROOT / "tmp" / "imagegen" / "plus-resurs-qr.png"
LOGO_SOURCE = ROOT / "frontend" / "public" / "og-default.png"
HEADER_ART_SOURCE = ROOT / "tmp" / "imagegen" / "resurs-plus-header-anime.png"
OUTPUT = ROOT / "output" / "imagegen" / "resurs-plus-engineering-collage.png"
OUTPUT_JPEG = ROOT / "output" / "imagegen" / "resurs-plus-engineering-collage-a4-300dpi.jpg"
OUTPUT_PDF = ROOT / "output" / "imagegen" / "resurs-plus-engineering-collage-print-cmyk.pdf"

DPI = 300
TRIM_WIDTH_MM = 203
TRIM_HEIGHT_MM = 288
BLEED_MM = 3
SAFE_MM = 10
WIDTH = round((TRIM_WIDTH_MM + BLEED_MM * 2) / 25.4 * DPI)
HEIGHT = round((TRIM_HEIGHT_MM + BLEED_MM * 2) / 25.4 * DPI)
BLEED_PX = round(BLEED_MM / 25.4 * DPI)
SAFE_PX = round(SAFE_MM / 25.4 * DPI)
SAFE_LEFT = BLEED_PX + SAFE_PX
SAFE_RIGHT = WIDTH - BLEED_PX - SAFE_PX
SAFE_TOP = BLEED_PX + SAFE_PX
SAFE_BOTTOM = HEIGHT - BLEED_PX - SAFE_PX
HEADER_HEIGHT = 500
FOOTER_TOP = 3010

ORANGE = "#FF9800"
ORANGE_DARK = "#E77900"
NAVY = "#0D2037"
INK = "#000000"
TEXT = "#000000"
MUTED = "#727A84"
PAPER = "#FBFAF7"
WHITE = "#FFFFFF"

FONT_DIR = Path(r"C:\Windows\Fonts")
REGULAR = FONT_DIR / "segoeui.ttf"
BOLD = FONT_DIR / "segoeuib.ttf"
BOLD_ITALIC = FONT_DIR / "segoeuiz.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(BOLD if bold else REGULAR), size=size)


def heading_font(size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(BOLD_ITALIC), size=size)


def rounded_panel(
    layer: Image.Image,
    box: tuple[int, int, int, int],
    fill: tuple[int, int, int, int],
    outline: str | None = None,
    width: int = 0,
    radius: int = 28,
) -> None:
    draw = ImageDraw.Draw(layer)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def wrapped_lines(
    draw: ImageDraw.ImageDraw,
    text: str,
    selected_font: ImageFont.FreeTypeFont,
    max_width: int,
) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=selected_font)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    max_width: int,
    selected_font: ImageFont.FreeTypeFont,
    fill: str,
    line_gap: int = 8,
    anchor: str = "la",
    black_mask_draw: ImageDraw.ImageDraw | None = None,
) -> int:
    x, y = xy
    lines = wrapped_lines(draw, text, selected_font, max_width)
    line_height = selected_font.size + line_gap
    for index, line in enumerate(lines):
        line_xy = (x, y + index * line_height)
        draw.text(line_xy, line, font=selected_font, fill=fill, anchor=anchor)
        if black_mask_draw is not None:
            black_mask_draw.text(line_xy, line, font=selected_font, fill=255, anchor=anchor)
    return len(lines) * line_height


def draw_black_text(
    draw: ImageDraw.ImageDraw,
    black_mask_draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    selected_font: ImageFont.FreeTypeFont,
    anchor: str = "la",
) -> None:
    draw.text(xy, text, font=selected_font, fill=INK, anchor=anchor)
    black_mask_draw.text(xy, text, font=selected_font, fill=255, anchor=anchor)


def draw_category(
    draw: ImageDraw.ImageDraw,
    black_mask_draw: ImageDraw.ImageDraw,
    layer: Image.Image,
    y: int,
    number: int,
    title: str,
    body: str,
    height: int,
) -> None:
    box = (SAFE_LEFT, y, 900, y + height)
    rounded_panel(layer, box, (255, 255, 255, 235), outline="#DADDE2", width=3, radius=24)
    number_left = SAFE_LEFT + 18
    draw.rounded_rectangle((number_left, y + 22, number_left + 60, y + 82), radius=18, fill=ORANGE)
    draw.text(
        (number_left + 30, y + 52),
        str(number),
        font=heading_font(28),
        fill=WHITE,
        anchor="mm",
    )
    if height > 122:
        draw.rounded_rectangle((number_left + 2, y + 98, number_left + 16, y + height - 24), radius=7, fill=ORANGE)
    title_y = y + 24
    text_x = SAFE_LEFT + 96
    text_width = 900 - text_x - 24
    title_height = draw_wrapped(
        draw,
        title.upper(),
        (text_x, title_y),
        text_width,
        heading_font(33),
        INK,
        line_gap=5,
        black_mask_draw=black_mask_draw,
    )
    if body:
        draw_wrapped(
            draw,
            body,
            (text_x, title_y + title_height + 8),
            text_width,
            font(31),
            TEXT,
            line_gap=6,
            black_mask_draw=black_mask_draw,
        )


def make_qr(size: int) -> Image.Image:
    qr = Image.open(QR_SOURCE).convert("RGBA").resize((size, size), Image.Resampling.NEAREST)
    pixels = qr.load()
    for y in range(qr.height):
        for x in range(qr.width):
            red, green, blue, _ = pixels[x, y]
            pixels[x, y] = (red, green, blue, 0 if red > 235 and green > 235 and blue > 235 else 255)
    return qr


def make_logo(height: int) -> Image.Image:
    logo = Image.open(LOGO_SOURCE).convert("RGBA").crop((118, 190, 315, 440))
    pixels = logo.load()
    for y in range(logo.height):
        for x in range(logo.width):
            red, green, blue, alpha = pixels[x, y]
            if red > 245 and green > 245 and blue > 245:
                pixels[x, y] = (red, green, blue, 0)
            else:
                pixels[x, y] = (red, green, blue, alpha)
    width = round(logo.width * height / logo.height)
    return logo.resize((width, height), Image.Resampling.LANCZOS)


def paste_header_art(canvas: Image.Image) -> None:
    source = Image.open(HEADER_ART_SOURCE).convert("RGBA")
    source = source.crop((260, 0, source.width, source.height))
    art_width = WIDTH - 1310
    art = ImageOps.fit(
        source,
        (art_width, HEADER_HEIGHT),
        method=Image.Resampling.LANCZOS,
        centering=(0.65, 0.48),
    )
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    layer.paste(art, (1310, 0))
    mask = Image.new("L", canvas.size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.polygon(
        ((1470, 0), (WIDTH, 0), (WIDTH, HEADER_HEIGHT), (1310, HEADER_HEIGHT)),
        fill=255,
    )
    canvas.alpha_composite(Image.composite(layer, Image.new("RGBA", canvas.size), mask))
    divider = ImageDraw.Draw(canvas)
    divider.line((1466, 0, 1306, HEADER_HEIGHT), fill=ORANGE, width=10)


def draw_bullet_column(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    heading: str,
    bullets: list[str],
) -> None:
    draw_wrapped(draw, heading, (x, y), width, heading_font(36), WHITE, line_gap=3)
    cursor = y + 60
    for bullet in bullets:
        draw.line(
            ((x, cursor + 13), (x + 5, cursor + 19), (x + 16, cursor + 6)),
            fill=ORANGE,
            width=4,
            joint="curve",
        )
        used = draw_wrapped(
            draw,
            bullet,
            (x + 25, cursor),
            width - 25,
            font(28),
            "#E7ECF2",
            line_gap=4,
        )
        cursor += used + 8


def to_print_cmyk(image: Image.Image, black_mask: Image.Image) -> Image.Image:
    cyan, magenta, yellow, black = image.convert("CMYK").split()
    zero = Image.new("L", image.size, 0)
    full_black = Image.new("L", image.size, 255)
    cyan = Image.composite(zero, cyan, black_mask)
    magenta = Image.composite(zero, magenta, black_mask)
    yellow = Image.composite(zero, yellow, black_mask)
    black = Image.composite(full_black, black, black_mask)
    return Image.merge("CMYK", (cyan, magenta, yellow, black))


def build() -> None:
    source = Image.open(SOURCE).convert("RGB")
    fitted_background = ImageOps.fit(source, (WIDTH, HEIGHT), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    background = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    middle = fitted_background.crop((0, 315, WIDTH, 3050))
    middle = middle.resize((WIDTH, FOOTER_TOP - HEADER_HEIGHT), Image.Resampling.LANCZOS)
    background.paste(middle, (0, HEADER_HEIGHT))
    canvas = background.convert("RGBA")
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))

    rounded_panel(overlay, (0, 0, WIDTH, HEADER_HEIGHT), (251, 250, 247, 248), radius=0)
    rounded_panel(overlay, (0, FOOTER_TOP, WIDTH, HEIGHT), (8, 24, 43, 255), radius=0)
    canvas = Image.alpha_composite(canvas, overlay)
    paste_header_art(canvas)
    draw = ImageDraw.Draw(canvas)
    black_mask = Image.new("L", canvas.size, 0)
    black_mask_draw = ImageDraw.Draw(black_mask)

    logo = make_logo(205)
    canvas.paste(logo, (SAFE_LEFT, 142), logo)
    draw.text((350, 110), "ЕДИНАЯ ЦИФРОВАЯ ПЛОЩАДКА", font=heading_font(30), fill=ORANGE_DARK)
    draw_black_text(draw, black_mask_draw, (350, 165), "РЕСУРС-ПЛЮС", heading_font(78))
    draw_black_text(
        draw,
        black_mask_draw,
        (353, 281),
        "Инженерные проекты, экспертиза",
        heading_font(34),
    )
    draw_black_text(
        draw,
        black_mask_draw,
        (353, 330),
        "и проверенные специалисты по всей России",
        font(34),
    )
    categories = [
        (
            1,
            "Экспертиза промышленной безопасности опасных производственных объектов",
            "Аттестованные эксперты по промышленной безопасности — выбирайте исполнителя ближе к вашему опасному производственному объекту.",
            320,
        ),
        (
            2,
            "Проектирование промышленных и гражданских объектов",
            "Аттестованные члены НОПРИЗ, включенные в НРС.",
            245,
        ),
        (
            3,
            "Инженерные изыскания (ИГИ, ИГДИ, ИЭИ, ИГМИ, геофизика)",
            "Члены НОПРИЗ, включенные в НРС, готовы выполнить камеральные и полевые работы.",
            270,
        ),
        (
            4,
            "Строительный контроль",
            "Аттестованные члены НОСТРОЙ, включенные в НРС.",
            185,
        ),
        (
            5,
            "Аудит",
            "Независимая оценка процессов, документации и систем управления промышленной безопасности.",
            205,
        ),
        (
            6,
            "Экологическое сопровождение предприятий",
            "Инженеры-экологи с высшим профессиональным образованием и многолетним опытом.",
            240,
        ),
        (
            7,
            "НИРы и лабораторные исследования",
            "Научно-исследовательские работы и лабораторные испытания для инженерных задач.",
            230,
        ),
        (
            8,
            "Техническое освидетельствование, техническое диагностирование",
            "Оценка состояния оборудования и технических устройств специалистами профильных направлений.",
            285,
        ),
        (
            9,
            "Кадастровые работы",
            "Специалисты, состоящие в СРО кадастровых инженеров.",
            190,
        ),
        (
            10,
            "Судебная экспертиза",
            "Профессиональные исследования и заключения по вопросам, имеющим значение для судебного дела.",
            230,
        ),
    ]

    y = 505
    for number, title, body, height in categories:
        draw_category(draw, black_mask_draw, canvas, y, number, title, body, height)
        y += height + 8

    qr_size = 260
    qr_center_x = 1605
    qr_label_x = qr_center_x
    qr_center_y = 1900
    qr_x = qr_center_x - qr_size // 2
    qr_y = qr_center_y - qr_size // 2
    qr = make_qr(qr_size)
    canvas.paste(qr, (qr_x, qr_y), qr)
    draw.rounded_rectangle(
        (qr_label_x - 142, qr_y + qr_size + 22, qr_label_x + 142, qr_y + qr_size + 74),
        radius=24,
        fill=NAVY,
    )
    draw.text(
        (qr_label_x, qr_y + qr_size + 48),
        "plus-resurs.com",
        font=font(25, bold=True),
        fill=WHITE,
        anchor="mm",
    )

    customer = [
        "Публикация проекта с подробным техническим заданием.",
        "Поиск или ожидание откликов.",
        "Сравнение и выбор специалиста.",
        "Управление проектом.",
    ]
    specialist = [
        "Цифровой профиль вместо классического резюме.",
        "Лента актуальных заказов и автоматические приглашения.",
        "Заявка с коммерческим предложением и планом решения.",
        "Выполнение проекта и получение оплаты.",
    ]
    draw_bullet_column(draw, SAFE_LEFT, FOOTER_TOP + 55, 1010, "Для заказчика:", customer)
    draw_bullet_column(draw, 1270, FOOTER_TOP + 55, SAFE_RIGHT - 1270, "Для специалиста:", specialist)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    result = canvas.convert("RGB")
    print_result = to_print_cmyk(result, black_mask)
    result.save(OUTPUT, format="PNG", optimize=True, dpi=(DPI, DPI))
    print_result.save(
        OUTPUT_JPEG,
        format="JPEG",
        quality=96,
        subsampling=0,
        optimize=True,
        dpi=(DPI, DPI),
    )
    print_result.save(OUTPUT_PDF, format="PDF", resolution=DPI, quality=96)
    print(OUTPUT)
    print(OUTPUT_JPEG)
    print(OUTPUT_PDF)


if __name__ == "__main__":
    build()
