import json
import sys
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Flowable, SimpleDocTemplate, Spacer, Table, TableStyle
from reportlab.lib.utils import ImageReader

if len(sys.argv) != 3:
    raise SystemExit("Uso: render_pdf.py <datos.json> <salida.pdf>")


input_path = Path(sys.argv[1]).resolve()
output_path = Path(sys.argv[2]).resolve()
output_path.parent.mkdir(parents=True, exist_ok=True)

with input_path.open("r", encoding="utf-8") as source:
    payload = json.load(source)

# Compatibilidad:
# - antes: {"hoja": {...}}
# - ahora: [{...}, {...}, ...]

if isinstance(payload, dict):
    hojas = [payload["hoja"]]
else:
    hojas = payload

perfil = hojas[0]["perfil"]
hoja = hojas[0]

THEMES = {
    "amarilla": (colors.HexColor("#FFF200"), colors.black),
    "azul": (colors.HexColor("#5B9BD5"), colors.white),
    "verde": (colors.HexColor("#70AD47"), colors.white),
    "papu": (colors.HexColor("#D9D9D9"), colors.black),
}

HEADER_COLOR, HEADER_TEXT = THEMES[perfil]
BLACK = colors.black
PAGE_WIDTH, PAGE_HEIGHT = A4
LEFT = RIGHT = 15 * mm
TOP = 10 * mm
BOTTOM = 10 * mm
LOGO_PATH = Path(__file__).resolve().parents[2] / "frontend" / "public" / "logos" / "sebamar.png"
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

WHATSAPP_ICON = ImageReader(
    os.path.join(BASE_DIR, "assets", "whatsapp.png")
)

MAPS_ICON = ImageReader(
    os.path.join(BASE_DIR, "assets", "maps.png")
)

def register_fonts():
    fonts = Path("C:/Windows/Fonts")
    regular = fonts / "arial.ttf"
    bold = fonts / "arialbd.ttf"
    italic = fonts / "arialbi.ttf"
    if regular.exists() and bold.exists() and italic.exists():
        pdfmetrics.registerFont(TTFont("Sebamar", str(regular)))
        pdfmetrics.registerFont(TTFont("SebamarBold", str(bold)))
        pdfmetrics.registerFont(TTFont("SebamarBoldItalic", str(italic)))
        return "Sebamar", "SebamarBold", "SebamarBoldItalic"
    return "Helvetica", "Helvetica-Bold", "Helvetica-BoldOblique"


FONT, FONT_BOLD, FONT_BOLD_ITALIC = register_fonts()


class Header(Flowable):
    def __init__(self, width, title, estrecha=False):
        super().__init__()
        self.width = width
        self.title = title
        self.estrecha = estrecha
        self.height = 42 * mm

    def wrap(self, available_width, available_height):
        return self.width, self.height

    def draw(self):
        canvas = self.canv
        logo_width = 68 * mm
        logo_height = 23 * mm
        canvas.drawImage(
            str(LOGO_PATH),
            (self.width - logo_width) / 2,
            self.height - logo_height - 2 * mm,
            width=logo_width,
            height=logo_height,
            preserveAspectRatio=True,
            mask="auto",
)
        
        canvas.setFillColor(BLACK)
        canvas.setFont(FONT_BOLD, 7.6)
        

       # ---------- WhatsApp ----------
        wa_text = "2314-483072"
        wa_y = 17 * mm

        text_width = canvas.stringWidth(wa_text, FONT_BOLD, 7.6)

        # Texto
        canvas.drawString(
            (self.width - text_width - 6 * mm) / 2,
            wa_y,
            wa_text,
        )

        # Icono a la derecha del texto
        canvas.drawImage(
            WHATSAPP_ICON,
            (self.width - text_width - 6 * mm) / 2 + text_width + 1.5 * mm,
            wa_y - 1.8 * mm,
            width=4.5 * mm,
            height=4.5 * mm,
            preserveAspectRatio=True,
            mask="auto",
        )

        # ---------- Dirección ----------
        dir_text = "AV. VENEZUELA 100 - BOLIVAR"
        dir_y = 12.8 * mm

        canvas.drawImage(
            MAPS_ICON,
            self.width / 2 - 27 * mm,
            dir_y - 2 * mm,
            width=4.6 * mm,
            height=4.6 * mm,
            preserveAspectRatio=True,
            mask="auto",
        )

        canvas.drawString(
            self.width / 2 - 21 * mm,
            dir_y,
            dir_text,
        )
       # Determinar ancho y posición de la banda del título

        if hoja.get("tituloAncho"):
            title_width = hoja["tituloAncho"] * mm
            title_x = (self.width - title_width) / 2

        elif self.estrecha:
            title_width = 82 * mm
            title_x = (self.width - title_width) / 2

        elif hoja.get("compacta"):
            title_width = 145 * mm
            title_x = ((self.width - title_width) / 2) - 2 * mm

        else:
            title_width = self.width
            title_x = 0
        canvas.setFillColor(HEADER_COLOR)
        canvas.setStrokeColor(BLACK)
        canvas.setLineWidth(1)
        canvas.rect(title_x, 0, title_width, 10 * mm, fill=1, stroke=1)
        canvas.setFillColor(HEADER_TEXT)
        canvas.setFont(
            FONT_BOLD_ITALIC,
            hoja.get("tituloFuente", 11),
        )
        canvas.drawCentredString(
            title_x + title_width / 2,
            3.4 * mm,
            self.title,
        )


def format_value(value):
    if isinstance(value, (int, float)):
        return str(int(value))
    return str(value)


def render_table(filas=None):
    if filas is None:
        filas = hoja["filas"]

    rows = [hoja["columnas"]]
    for row in filas:
        rows.append([format_value(row[campo]) for campo in hoja["campos"]])

    width = PAGE_WIDTH - LEFT - RIGHT

    if hoja.get("detalleAncho"):
        column_widths = [width * 0.55, width * 0.15, width * 0.30]
    elif hoja.get("estrecha"):
        column_widths = [41 * mm, 41 * mm]
    elif hoja.get("compacta"):
        cantidad_precios = len(hoja["columnas"]) - 1
        column_widths = [width * 0.14] + [width * (0.86 / cantidad_precios)] * cantidad_precios
    else:
        column_widths = [width * 0.15, width * 0.205, width * 0.25, width * 0.19, width * 0.205]

    table = Table(rows, colWidths=column_widths, repeatRows=1, hAlign="CENTER")

    if hoja.get("compacta"):
        font_size, leading, padding = 5.15, 5.6, 0.12
    else:
        font_size, leading, padding = 7.4, 8.5, 0.7

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), HEADER_COLOR),
        ("BACKGROUND", (0, 1), (0, -1), HEADER_COLOR),
        ("TEXTCOLOR", (0, 0), (-1, 0), HEADER_TEXT),
        ("FONTNAME", (0, 0), (-1, 0), FONT_BOLD),
        ("FONTNAME", (0, 1), (0, -1), FONT_BOLD),
        ("FONTNAME", (1, 1), (-1, -1), FONT),
        ("FONTSIZE", (0, 0), (-1, 0), font_size + 0.4),
        ("FONTSIZE", (0, 1), (-1, -1), font_size),
        ("LEADING", (0, 0), (-1, -1), leading),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.35, BLACK),
        ("BOX", (0, 0), (-1, -1), 1.20, BLACK),
        ("TOPPADDING", (0, 0), (-1, 0), padding + 1.2),
        ("BOTTOMPADDING", (0, 0), (-1, 0), padding + 1.2),
        ("TOPPADDING", (0, 1), (-1, -1), padding + 0.25),
        ("BOTTOMPADDING", (0, 1), (-1, -1), max(0, padding - 0.25)),
        ("TOPPADDING", (0, -1), (-1, -1), padding + 0.25),
        ("BOTTOMPADDING", (0, -1), (-1, -1), padding + 1.5),
    ]))

    return table


class RajaDiagram(Flowable):
    def __init__(self, width):
        super().__init__()
        self.width = width
        self.height = 52 * mm

    def wrap(self, aw, ah):
        return self.width, self.height

    def draw(self):
        canvas = self.canv

        image_path = os.path.join(BASE_DIR, "assets", "rajas_sentido.png")

        canvas.drawImage(
            image_path,
            (self.width - 150 * mm) / 2,
            0,
            width=150 * mm,
            height=52 * mm,
            preserveAspectRatio=True,
            mask="auto",
        )


class DoorGrid(Flowable):
    def __init__(self, width, eco=False):
        super().__init__()
        self.width = width
        self.eco = eco
        self.height = 120 * mm if not eco else 70 * mm

    def wrap(self, aw, ah):
        return self.width, self.height

    def draw(self):
        canvas = self.canv

        image_name = (
            "puertas_eco_modelos.png"
            if self.eco
            else "puertas_modelos.png"
        )

        image_path = os.path.join(
            BASE_DIR,
            "assets",
            image_name,
        )

        if self.eco:
            img_width = 125 * mm
            img_height = 65 * mm
        else:
            img_width = 150 * mm
            img_height = 118 * mm

        canvas.drawImage(
            image_path,
            (self.width - img_width) / 2,
            0,
            width=img_width,
            height=img_height,
            preserveAspectRatio=True,
            mask="auto",
        )

def render_note(text):
    width = 145 * mm
    note = Table([[text]], colWidths=[width], hAlign="CENTER")
    note.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HEADER_COLOR),
        ("TEXTCOLOR", (0, 0), (-1, -1), HEADER_TEXT),
        ("FONTNAME", (0, 0), (-1, -1), FONT_BOLD),
        ("FONTSIZE", (0, 0), (-1, -1), 6.4),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.7, BLACK),
        ("TOPPADDING", (0, 0), (-1, -1), 1.1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1.1),
    ]))
    return note

def render_section_header(text):
    width = 145 * mm

    header = Table(
        [[text]],
        colWidths=[width],
        hAlign="CENTER",
    )

    header.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HEADER_COLOR),
        ("TEXTCOLOR", (0, 0), (-1, -1), HEADER_TEXT),

        ("FONTNAME", (0, 0), (-1, -1), FONT_BOLD),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),

        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),

        ("GRID", (0, 0), (-1, -1), 0.7, BLACK),
        ("BOX", (0, 0), (-1, -1), 1.2, BLACK),

        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))

    return header


def footer(canvas, document):
    canvas.saveState()
    canvas.setFont(FONT, 7)
    canvas.setFillColor(BLACK)
    canvas.drawRightString(PAGE_WIDTH - RIGHT, 6 * mm, f"Pagina {document.page}")
    canvas.restoreState()


document = SimpleDocTemplate(
    str(output_path),
    pagesize=A4,
    leftMargin=LEFT,
    rightMargin=RIGHT,
    topMargin=TOP,
    bottomMargin=BOTTOM,
    title="Lista Sebamar",
    author="Sebamar",
)

story = []

for indice, hoja in enumerate(hojas):

    if indice > 0:
        from reportlab.platypus import PageBreak
        story.append(PageBreak())

    story.extend([
        Header(
            PAGE_WIDTH - LEFT - RIGHT,
            hoja["titulo"],
            hoja.get("estrecha", False),
        ),
        Spacer(1, 2.5 * mm),
        render_table(),
    ])

    if hoja.get("secciones"):
        for seccion in hoja["secciones"]:
            story.extend([
                Spacer(1, 5 * mm),
                render_section_header(seccion["titulo"]),
                Spacer(1, 2 * mm),
                render_table(seccion["filas"]),
            ])

    if hoja.get("nota"):
        story.extend([
            Spacer(1, 1 * mm),
            render_note(hoja["nota"]),
        ])

    if hoja.get("diagrama") == "rajas":
        story.extend([
            Spacer(1, 1 * mm),
            RajaDiagram(PAGE_WIDTH - LEFT - RIGHT),
        ])

    if hoja.get("diagrama") == "puertas":
        story.extend([
            Spacer(1, 1 * mm),
            DoorGrid(PAGE_WIDTH - LEFT - RIGHT),
        ])

    if hoja.get("diagrama") == "puertas-eco":
        story.extend([
            Spacer(1, 1 * mm),
            DoorGrid(PAGE_WIDTH - LEFT - RIGHT, eco=True),
        ])

document.build(
    story,
    onFirstPage=footer,
    onLaterPages=footer,
)

print(f"PDF creado: {output_path}")