import os
from PIL import Image, ImageDraw, ImageFont

# Generate a high-resolution 1000x360 px mockup of the Health Passport Card for Q6
width, height = 1040, 370
img = Image.new('RGB', (width, height), color='#f8fafc')
draw = ImageDraw.Draw(img)

# Card container
card_rect = [10, 10, width - 10, height - 10]
draw.rounded_rectangle(card_rect, radius=16, fill='#ffffff', outline='#cbd5e1', width=3)

# Red emergency header
header_rect = [10, 10, width - 10, 60]
draw.rounded_rectangle(header_rect, radius=16, fill='#dc2626')
draw.rectangle([10, 45, width - 10, 60], fill='#dc2626') # square bottom corners of header

# Text drawing
# Use default or basic truetype font
try:
    font_bold_lg = ImageFont.truetype("arialbd.ttf", 22)
    font_bold_md = ImageFont.truetype("arialbd.ttf", 16)
    font_bold_sm = ImageFont.truetype("arialbd.ttf", 13)
    font_reg = ImageFont.truetype("arial.ttf", 12)
    font_bold_blood = ImageFont.truetype("arialbd.ttf", 46)
    font_mono = ImageFont.truetype("consola.ttf", 11)
except Exception:
    font_bold_lg = font_bold_md = font_bold_sm = font_reg = font_bold_blood = font_mono = ImageFont.load_default()

# Header text
draw.text((25, 22), "STUDENT HEALTH PASSPORT - DIGITAL EMERGENCY CARD", fill='#ffffff', font=font_bold_md)
draw.text((width - 240, 22), "RISK LEVEL: HIGH", fill='#fef08a', font=font_bold_md)

# Student identity section (Left side)
# Avatar placeholder box
draw.rounded_rectangle([25, 75, 115, 165], radius=12, fill='#e0f2fe', outline='#0284c7', width=2)
draw.text((50, 105), "PHOTO\nAVATAR", fill='#0369a1', font=font_bold_sm)

draw.text((130, 75), "Aarav Sharma", fill='#0f172a', font=font_bold_lg)
draw.text((130, 105), "Grade 6-A  |  Roll: 6A-14  |  Age: 11  |  DOB: 12-May-2015", fill='#475569', font=font_bold_sm)
draw.text((130, 125), "Primary Condition: Moderate Persistent Asthma", fill='#dc2626', font=font_bold_sm)
draw.text((130, 145), "Consent ID: CONSENT-2026-0614-AS  [VERIFIED & SIGNED]", fill='#15803d', font=font_mono)

# Blood Group Box (Center)
draw.rounded_rectangle([510, 75, 680, 175], radius=12, fill='#fef2f2', outline='#fca5a5', width=2)
draw.text((530, 82), "BLOOD GROUP", fill='#991b1b', font=font_bold_sm)
draw.text((560, 100), "B+", fill='#dc2626', font=font_bold_blood)
draw.text((525, 155), "Rh Positive  |  Can receive B+, B-, O+, O-", fill='#7f1d1d', font=ImageFont.truetype("arial.ttf", 9) if 'arial.ttf' in locals() else font_reg)

# Offline QR Code Placeholder (Right side)
draw.rounded_rectangle([700, 75, 800, 175], radius=12, fill='#f1f5f9', outline='#94a3b8', width=2)
# Draw mini QR pattern
for r in range(5):
    for c in range(5):
        if (r + c) % 2 == 0 or (r == 0 and c == 0) or (r == 4 and c == 4) or (r == 0 and c == 4):
            draw.rectangle([715 + c * 14, 85 + r * 14, 725 + c * 14, 95 + r * 14], fill='#0f172a')
draw.text((710, 158), "Instant QR Scan", fill='#334155', font=ImageFont.truetype("arial.ttf", 9) if 'arial.ttf' in locals() else font_reg)

# Emergency Contacts Box (Far Right)
draw.rounded_rectangle([815, 75, 1015, 175], radius=12, fill='#f0fdf4', outline='#86efac', width=2)
draw.text((825, 82), "EMERGENCY CONTACTS", fill='#166534', font=font_bold_sm)
draw.text((825, 102), "Father: Rajesh Sharma", fill='#0f172a', font=font_bold_sm)
draw.text((825, 118), "+91 98101 23456 [1-Tap Call]", fill='#0284c7', font=font_mono)
draw.text((825, 138), "Pediatrician: Dr. Vivek Mehra", fill='#334155', font=font_reg)
draw.text((825, 154), "Max Hospital Saket: 011-26515050", fill='#334155', font=font_mono)

# Divider line
draw.line([(25, 185), (width - 25, 185)], fill='#e2e8f0', width=2)

# Bottom Row Left: Critical Allergies Alert
draw.rounded_rectangle([25, 195, 340, 310], radius=10, fill='#fff1f2', outline='#fecdd3', width=2)
draw.text((35, 202), "KNOWN ALLERGIES & CONTRAINDICATIONS:", fill='#be123c', font=font_bold_sm)
draw.text((35, 222), "• Penicillin Antibiotics (CRITICAL ANAPHYLAXIS RISK)", fill='#9f1239', font=font_bold_sm)
draw.text((35, 240), "   -> STRICTLY AVOID: Amoxicillin, Augmentin", fill='#881337', font=font_bold_sm)
draw.text((35, 260), "• Dust Mites & Chalk Dust (Moderate Bronchospasm)", fill='#334155', font=font_reg)
draw.text((35, 280), "• In-School Medicine: Salbutamol Inhaler (Clinic Kit #1)", fill='#0369a1', font=font_bold_sm)

# Bottom Row Center: Step-by-Step Action Directive
draw.rounded_rectangle([355, 195, 780, 310], radius=10, fill='#0f172a')
draw.text((370, 202), "EMERGENCY ACTION PROTOCOL (NURSE / TEACHER DIRECTIVE):", fill='#38bdf8', font=font_bold_sm)
draw.text((370, 222), "1. Position: Keep Aarav seated upright and calm. Never lay him flat.", fill='#ffffff', font=font_reg)
draw.text((370, 240), "2. Inhaler: Administer Salbutamol (Asthalin) - 2 puffs via AeroChamber spacer.", fill='#ffffff', font=font_bold_sm)
draw.text((370, 258), "3. Recheck: Wait 3 minutes. If wheezing persists, give 2 more puffs (total 4).", fill='#ffffff', font=font_reg)
draw.text((370, 276), "4. Escalate: If lips turn blue or struggling after 5 mins, dial 108 Ambulance immediately.", fill='#f87171', font=font_bold_sm)
draw.text((370, 294), "5. Contraindication: DO NOT administer any Penicillin under any circumstance.", fill='#fca5a5', font=font_bold_sm)

# Bottom Row Right: Footer status badge
draw.rounded_rectangle([795, 195, 1015, 310], radius=10, fill='#f8fafc', outline='#cbd5e1', width=2)
draw.text((805, 205), "VERIFICATION & COMPLIANCE", fill='#475569', font=font_bold_sm)
draw.text((805, 225), "Status: Active School Passport", fill='#16a34a', font=font_bold_sm)
draw.text((805, 243), "Audited by: Sr. Mary Thomas, RN", fill='#334155', font=font_reg)
draw.text((805, 261), "Parent Auth: Rajesh Sharma (Father)", fill='#334155', font=font_reg)
draw.text((805, 279), "Ambulance Emergency: Dial 108", fill='#dc2626', font=font_bold_sm)
draw.text((805, 295), "Last Updated: September 2026", fill='#64748b', font=font_mono)

# Bottom timestamp bar
draw.text((25, 330), "Student Health Passport • HCL Jigsaw Edition 7 • Grade 6 Medical Innovation & Smart Healthcare", fill='#64748b', font=font_mono)
draw.text((width - 320, 330), "Card Spec: Single Viewport CR80 / Digital Layout", fill='#64748b', font=font_mono)

output_path = r'C:\Users\HP\Desktop\StudentHealthPassport\health_card_mockup.png'
img.save(output_path, quality=95)
print("health_card_mockup.png generated successfully at:", output_path)
