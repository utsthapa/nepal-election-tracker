"""
Enumerated Unity - Visual Expression (Refined)
A design artifact embodying the philosophy of collective counting
Master-level execution with painstaking attention to every detail
"""

from reportlab.lib.pagesizes import A3
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import math
import random

# Set seed for reproducibility
random.seed(2079)  # The year of the election - a subtle reference

# Color palette - refined, harmonious
DEEP_INDIGO = Color(0.078, 0.102, 0.192)   # Primary dark
WARM_EARTH = Color(0.722, 0.486, 0.341)    # Accent warm
CREAM = Color(0.973, 0.965, 0.949)         # Background
LIGHT_INDIGO = Color(0.196, 0.239, 0.369)  # Secondary
FADED_EARTH = Color(0.863, 0.761, 0.667)   # Muted accent
WHISPER_INDIGO = Color(0.294, 0.333, 0.443) # Very light indigo

# Register fonts
font_dir = r"C:\Users\lbikr\.claude\skills\canvas-design\canvas-fonts"
try:
    pdfmetrics.registerFont(TTFont('Jura-Light', f'{font_dir}/Jura-Light.ttf'))
    pdfmetrics.registerFont(TTFont('DMMono', f'{font_dir}/DMMono-Regular.ttf'))
    pdfmetrics.registerFont(TTFont('Italiana', f'{font_dir}/Italiana-Regular.ttf'))
    pdfmetrics.registerFont(TTFont('PoiretOne', f'{font_dir}/PoiretOne-Regular.ttf'))
    pdfmetrics.registerFont(TTFont('InstrumentSerif', f'{font_dir}/InstrumentSerif-Regular.ttf'))
except:
    pass

def create_enumerated_unity():
    # A3 landscape for expansive composition
    width, height = A3[1], A3[0]  # Landscape

    c = canvas.Canvas(r"c:\Users\lbikr\nepalpoltiics\designs\enumerated_unity.pdf", pagesize=(width, height))

    # === BACKGROUND WITH SUBTLE TEXTURE ===
    c.setFillColor(CREAM)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    # Subtle grid texture across background
    c.setStrokeColor(Color(0.92, 0.91, 0.88, alpha=0.4))
    c.setLineWidth(0.1)
    for x in range(0, int(width), 12):
        c.line(x, 0, x, height)
    for y in range(0, int(height), 12):
        c.line(0, y, width, y)

    # Define margins
    margin = 50
    inner_width = width - 2 * margin
    inner_height = height - 2 * margin

    # === ELEGANT BORDER SYSTEM ===
    # Outer frame
    c.setStrokeColor(LIGHT_INDIGO)
    c.setLineWidth(0.35)
    c.rect(margin, margin, inner_width, inner_height, fill=0, stroke=1)

    # Inner frame with precise spacing
    c.setLineWidth(0.15)
    c.rect(margin + 6, margin + 6, inner_width - 12, inner_height - 12, fill=0, stroke=1)

    # Innermost hairline
    c.setLineWidth(0.08)
    c.setStrokeColor(WHISPER_INDIGO)
    c.rect(margin + 10, margin + 10, inner_width - 20, inner_height - 20, fill=0, stroke=1)

    # === MAIN COMPOSITION: TALLY MARKS ZONE ===
    tally_start_x = margin + 70
    tally_start_y = height - margin - 95
    tally_width = 480
    tally_height = 260

    # Section header line
    c.setStrokeColor(WARM_EARTH)
    c.setLineWidth(0.5)
    c.line(tally_start_x, tally_start_y + 35, tally_start_x + 120, tally_start_y + 35)

    c.setStrokeColor(DEEP_INDIGO)

    group_cols = 24
    group_rows = 13
    group_spacing_x = tally_width / group_cols
    group_spacing_y = tally_height / group_rows

    for row in range(group_rows):
        for col in range(group_cols):
            x = tally_start_x + col * group_spacing_x
            y = tally_start_y - row * group_spacing_y

            # Density gradient - denser toward center
            center_dist = math.sqrt((col - group_cols/2)**2 + (row - group_rows/2)**2)
            density_factor = 1.0 - (center_dist / (group_cols/2)) * 0.3

            if random.random() < 0.85 * density_factor:
                stroke_width = 0.35 + random.uniform(-0.05, 0.08)
                c.setLineWidth(stroke_width)

                mark_height = 7.5 + random.uniform(-0.3, 0.3)
                mark_spacing = 2.0

                # Tally group with precise spacing
                marks_in_group = 4 if random.random() > 0.1 else 5

                for i in range(min(marks_in_group, 4)):
                    if random.random() > 0.05:
                        mx = x + i * mark_spacing
                        slight_angle = random.uniform(-0.02, 0.02)
                        c.line(mx + slight_angle, y, mx - slight_angle, y - mark_height)

                # Diagonal strike (the fifth mark)
                if marks_in_group == 5 or random.random() > 0.2:
                    c.setLineWidth(stroke_width * 0.9)
                    c.line(x - 0.8, y - mark_height + 0.5, x + 3.2 * mark_spacing + 0.8, y - 0.5)
                    c.setLineWidth(stroke_width)

    # === CONCENTRIC WAVES - PARTICIPATION RINGS ===
    circle_center_x = width - margin - 170
    circle_center_y = height / 2 + 50

    # Base glow
    c.setFillColor(Color(0.863, 0.761, 0.667, alpha=0.15))
    c.circle(circle_center_x, circle_center_y, 145, fill=1, stroke=0)

    c.setStrokeColor(LIGHT_INDIGO)

    for i in range(32):
        radius = 18 + i * 4.0

        # Progressive line weight
        weight = 0.18 + (i % 4) * 0.06
        c.setLineWidth(weight)

        # Rotating incomplete arcs
        start_angle = (i * 11) % 360
        extent = 260 + math.sin(i * 0.3) * 50

        c.arc(circle_center_x - radius, circle_center_y - radius,
              circle_center_x + radius, circle_center_y + radius,
              start_angle, extent)

    # Central cluster - precise marks
    c.setFillColor(WARM_EARTH)
    for ring in range(3):
        ring_radius = 4 + ring * 5
        points = 6 + ring * 3
        for i in range(points):
            angle = (i * 360 / points + ring * 15) * math.pi / 180
            cx = circle_center_x + math.cos(angle) * ring_radius
            cy = circle_center_y + math.sin(angle) * ring_radius
            dot_size = 1.2 - ring * 0.2
            c.circle(cx, cy, dot_size, fill=1, stroke=0)

    # Central dot
    c.setFillColor(DEEP_INDIGO)
    c.circle(circle_center_x, circle_center_y, 2.5, fill=1, stroke=0)

    # === PROPORTIONAL BARS - SEVEN PROVINCES ===
    bar_x = margin + 70
    bar_y = margin + 130
    bar_section_width = 380

    bar_data = [
        (16, 0.6690),   # Province percentages - subtle reference
        (22, 0.6141),
        (28, 0.6185),
        (24, 0.6136),
        (20, 0.6131),
        (14, 0.6364),
        (18, 0.6310),
    ]

    c.setStrokeColor(DEEP_INDIGO)

    for i, (h, fill) in enumerate(bar_data):
        y_pos = bar_y + i * 26

        # Background bar outline
        c.setLineWidth(0.25)
        c.rect(bar_x, y_pos, bar_section_width, h, fill=0, stroke=1)

        # Inner fill
        fill_width = bar_section_width * fill
        c.setFillColor(FADED_EARTH)
        c.rect(bar_x + 0.5, y_pos + 0.5, fill_width - 1, h - 1, fill=1, stroke=0)

        # Accent line at fill boundary
        c.setStrokeColor(WARM_EARTH)
        c.setLineWidth(0.6)
        c.line(bar_x + fill_width, y_pos, bar_x + fill_width, y_pos + h)

        c.setStrokeColor(DEEP_INDIGO)

        # Tick marks inside bars
        c.setLineWidth(0.12)
        for tick in range(1, int(fill * 10)):
            tick_x = bar_x + (bar_section_width / 10) * tick
            if tick_x < bar_x + fill_width - 5:
                c.line(tick_x, y_pos + 1, tick_x, y_pos + 3)

    # === DOT MATRIX - INDIVIDUAL VOICES ===
    dot_start_x = width - margin - 400
    dot_start_y = margin + 85

    dot_cols = 42
    dot_rows = 16

    for row in range(dot_rows):
        for col in range(dot_cols):
            x = dot_start_x + col * 7.2
            y = dot_start_y + row * 7.8

            # Wave pattern density
            wave = math.sin(col * 0.18 + row * 0.12) * 0.3 + 0.65

            if random.random() < wave:
                # Color variation
                if random.random() > 0.85:
                    c.setFillColor(WARM_EARTH)
                    size = 1.4
                else:
                    c.setFillColor(DEEP_INDIGO)
                    size = 0.9 + random.uniform(-0.15, 0.15)

                c.circle(x, y, size, fill=1, stroke=0)

    # === VERTICAL SCALE - LEFT MARGIN ===
    scale_x = margin + 32
    scale_y_start = margin + 55
    scale_y_end = height - margin - 45

    c.setStrokeColor(LIGHT_INDIGO)
    c.setLineWidth(0.2)
    c.line(scale_x, scale_y_start, scale_x, scale_y_end)

    num_ticks = 50
    tick_spacing = (scale_y_end - scale_y_start) / num_ticks

    for i in range(num_ticks + 1):
        y = scale_y_start + i * tick_spacing

        if i % 10 == 0:
            tick_length = 9
            c.setLineWidth(0.35)
        elif i % 5 == 0:
            tick_length = 5
            c.setLineWidth(0.25)
        else:
            tick_length = 2.5
            c.setLineWidth(0.15)

        c.line(scale_x - tick_length, y, scale_x, y)

    # Horizontal scale at bottom
    h_scale_y = margin + 32
    h_scale_start = margin + 70
    h_scale_end = width - margin - 55

    c.setLineWidth(0.2)
    c.line(h_scale_start, h_scale_y, h_scale_end, h_scale_y)

    h_ticks = 80
    h_tick_spacing = (h_scale_end - h_scale_start) / h_ticks

    for i in range(h_ticks + 1):
        x = h_scale_start + i * h_tick_spacing
        if i % 10 == 0:
            c.setLineWidth(0.3)
            c.line(x, h_scale_y - 6, x, h_scale_y)
        elif i % 5 == 0:
            c.setLineWidth(0.2)
            c.line(x, h_scale_y - 4, x, h_scale_y)

    # === TYPOGRAPHY - MINIMAL, PRECISE ===
    c.setFillColor(DEEP_INDIGO)

    # Main title
    try:
        c.setFont('PoiretOne', 14)
    except:
        c.setFont('Helvetica', 14)

    c.drawString(margin + 70, height - margin - 42, "ENUMERATED UNITY")

    # Subtitle
    try:
        c.setFont('Jura-Light', 7)
    except:
        c.setFont('Helvetica', 7)

    c.setFillColor(LIGHT_INDIGO)
    c.drawString(margin + 70, height - margin - 56, "A cartography of collective voice")

    # Section labels
    try:
        c.setFont('DMMono', 5.5)
    except:
        c.setFont('Courier', 5.5)

    c.setFillColor(WHISPER_INDIGO)

    # Province numerals
    numerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    for i, num in enumerate(numerals):
        y_pos = bar_y + i * 26 + 5
        c.drawRightString(bar_x - 8, y_pos, num)

    # Figure references
    c.drawString(tally_start_x, tally_start_y + 22, "§ enumeration")
    c.drawString(circle_center_x - 20, circle_center_y - 155, "§ convergence")
    c.drawString(bar_x, bar_y - 18, "§ proportion")
    c.drawString(dot_start_x, dot_start_y - 18, "§ plurality")

    # Key numbers
    c.setFillColor(LIGHT_INDIGO)
    c.drawString(tally_start_x + tally_width + 15, tally_start_y - tally_height/2, "n = 275")
    c.drawString(bar_x + bar_section_width + 15, bar_y + 85, "n = 550")

    # Year notation
    try:
        c.setFont('InstrumentSerif', 8)
    except:
        c.setFont('Times-Roman', 8)

    c.setFillColor(WARM_EARTH)
    c.drawRightString(width - margin - 20, margin + 22, "२०७९")

    # === CONNECTING FILAMENTS ===
    c.setStrokeColor(Color(0.722, 0.486, 0.341, alpha=0.35))
    c.setLineWidth(0.12)
    c.setDash([1.5, 3])

    # Tally to circle connection
    c.line(tally_start_x + tally_width + 8, tally_start_y - tally_height/2 - 10,
           circle_center_x - 145, circle_center_y + 5)

    # Bars to dots
    c.line(bar_x + bar_section_width + 8, bar_y + 90,
           dot_start_x - 8, margin + 160)

    c.setDash([])

    # === REGISTRATION MARKS ===
    c.setStrokeColor(LIGHT_INDIGO)
    c.setLineWidth(0.25)

    corners = [
        (margin, height - margin),
        (width - margin, height - margin),
        (margin, margin),
        (width - margin, margin)
    ]

    for cx, cy in corners:
        c.circle(cx, cy, 3, fill=0, stroke=1)
        c.line(cx - 8, cy, cx - 4, cy)
        c.line(cx + 4, cy, cx + 8, cy)
        c.line(cx, cy - 8, cx, cy - 4)
        c.line(cx, cy + 4, cx, cy + 8)

    # === FINAL REFINEMENT: SUBTLE ACCENTS ===

    # Small marks in corners of content area
    c.setStrokeColor(FADED_EARTH)
    c.setLineWidth(0.3)

    # Top left accent
    c.line(margin + 18, height - margin - 18, margin + 18, height - margin - 28)
    c.line(margin + 18, height - margin - 18, margin + 28, height - margin - 18)

    # Bottom right accent
    c.line(width - margin - 18, margin + 18, width - margin - 18, margin + 28)
    c.line(width - margin - 18, margin + 18, width - margin - 28, margin + 18)

    c.save()
    print("PDF created: enumerated_unity.pdf")
    print("Design philosophy: enumerated_unity.md")

if __name__ == "__main__":
    create_enumerated_unity()
