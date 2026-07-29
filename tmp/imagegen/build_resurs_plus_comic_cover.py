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

WIDTH = 2480
HEIGHT = 3508

ORANGE = "#FF9800"
ORANGE_DARK = "#E77900"
NAVY = "#0D2037"
INK = "#15191F"
TEXT = "#3E4650"
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
) -> int:
    x, y = xy
    lines = wrapped_lines(draw, text, selected_font, max_width)
    line_height = selected_font.size + line_gap
    for index, line in enumerate(lines):
        draw.text((x, y + index * line_height), line, font=selected_font, fill=fill, anchor=anchor)
    return len(lines) * line_height


def draw_category(
    draw: ImageDraw.ImageDraw,
    layer: Image.Image,
    y: int,
    number: int,
    title: str,
    body: str,
    height: int,
) -> None:
    box = (62, y, 842, y + height)
    rounded_panel(layer, box, (255, 255, 255, 235), outline="#DADDE2", width=3, radius=24)
    draw.rounded_rectangle((80, y + 22, 140, y + 82), radius=18, fill=ORANGE)
    draw.text(
        (110, y + 52),
        str(number),
        font=heading_font(28),
        fill=WHITE,
        anchor="mm",
    )
    if height > 122:
        draw.rounded_rectangle((82, y + 98, 96, y + height - 24), radius=7, fill=ORANGE)
    title_y = y + 24
    title_height = draw_wrapped(
        draw,
        title.upper(),
        (158, title_y),
        630,
        heading_font(31),
        NAVY,
        line_gap=5,
    )
    if body:
        draw_wrapped(
            draw,
            body,
            (158, title_y + title_height + 8),
            630,
            font(29),
            TEXT,
            line_gap=6,
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
    art = ImageOps.fit(source, (1160, 520), method=Image.Resampling.LANCZOS, centering=(0.65, 0.48))
    layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    layer.paste(art, (1320, 0))
    mask = Image.new("L", canvas.size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.polygon(((1480, 0), (2480, 0), (2480, 520), (1320, 520)), fill=255)
    canvas.alpha_composite(Image.composite(layer, Image.new("RGBA", canvas.size), mask))
    divider = ImageDraw.Draw(canvas)
    divider.line((1476, 0, 1316, 520), fill=ORANGE, width=10)


def draw_bullet_column(
    draw: ImageDraw.ImageDraw,
    x: int,
    y: int,
    width: int,
    heading: str,
    bullets: list[str],
) -> None:
    draw_wrapped(draw, heading, (x, y), width, heading_font(33), WHITE, line_gap=3)
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
            font(24),
            "#E7ECF2",
            line_gap=4,
        )
        cursor += used + 8


def build() -> None:
    source = Image.open(SOURCE).convert("RGB")
    fitted_background = ImageOps.fit(source, (WIDTH, HEIGHT), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    background = Image.new("RGB", (WIDTH, HEIGHT), PAPER)
    middle = fitted_background.crop((0, 315, WIDTH, 3070))
    middle = middle.resize((WIDTH, 2595), Image.Resampling.LANCZOS)
    background.paste(middle, (0, 520))
    canvas = background.convert("RGBA")
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))

    rounded_panel(overlay, (0, 0, WIDTH, 520), (251, 250, 247, 248), radius=0)
    rounded_panel(overlay, (0, 3115, WIDTH, HEIGHT), (8, 24, 43, 255), radius=0)
    canvas = Image.alpha_composite(canvas, overlay)
    paste_header_art(canvas)
    draw = ImageDraw.Draw(canvas)

    logo = make_logo(205)
    canvas.paste(logo, (56, 144), logo)
    draw.text((260, 113), "ЕДИНАЯ ЦИФРОВАЯ ПЛОЩАДКА", font=heading_font(30), fill=ORANGE_DARK)
    draw.text((260, 168), "РЕСУРС-ПЛЮС", font=heading_font(78), fill=INK)
    draw.text(
        (263, 284),
        "Инженерные проекты, экспертиза",
        font=heading_font(34),
        fill=TEXT,
    )
    draw.text(
        (263, 333),
        "и проверенные специалисты по всей России",
        font=font(34),
        fill=TEXT,
    )
    categories = [
        (
            1,
            "Экспертиза промышленной безопасности опасных производственных объектов",
            "Аттестованные эксперты Ростехнадзора по всей стране - выбирайте исполнителя ближе к вашему опасному производственному объекту.",
            320,
        ),
        (
            2,
            "Проектирование промышленных и гражданских объектов",
            "Аттестованные члены НОПРИЗ, включенные в НРС.",
            220,
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
            200,
        ),
        (
            5,
            "Аудит",
            "Независимая оценка процессов, документации и систем управления предприятия.",
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
            210,
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
            205,
        ),
        (
            10,
            "Судебная экспертиза",
            "Профессиональные исследования и заключения по вопросам, имеющим значение для судебного дела.",
            245,
        ),
    ]

    y = 538
    for number, title, body, height in categories:
        draw_category(draw, canvas, y, number, title, body, height)
        y += height + 12

    qr_size = 300
    qr_center_x = 1615
    qr_label_x = 1595
    qr_center_y = 1958
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
        "Создание задачи: заказчик публикует проект, максимально подробно описывая техническое задание.",
        "Поиск или ожидание откликов.",
        "Выбор специалиста.",
        "Управление проектом.",
    ]
    specialist = [
        "Создание детального цифрового профиля, который заменяет классическое резюме.",
        "Просмотр ленты актуальных заказов или получение автоматических приглашений.",
        "Подача заявок с коммерческим предложением и планом решения задачи.",
        "Выполнение проекта и получение оплаты.",
    ]
    draw_bullet_column(draw, 80, 3150, 1050, "Для заказчика:", customer)
    draw_bullet_column(draw, 1280, 3150, 1110, "Для специалиста:", specialist)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    result = canvas.convert("RGB")
    result.save(OUTPUT, format="PNG", optimize=True, dpi=(300, 300))
    result.save(
        OUTPUT_JPEG,
        format="JPEG",
        quality=96,
        subsampling=0,
        optimize=True,
        dpi=(300, 300),
    )
    print(OUTPUT)
    print(OUTPUT_JPEG)


if __name__ == "__main__":
    build()
