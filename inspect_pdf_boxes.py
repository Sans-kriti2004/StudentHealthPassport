import fitz

doc = fitz.open(r'C:\Users\HP\Downloads\Medical-Grade+6+-+Student_Health_Passport_Team_Worksheet 2.pdf')

for i, page in enumerate(doc):
    print(f'=== PAGE {i+1} ===')
    for phrase in ['Type your answer here', 'Insert your sketch here', 'Q1.', 'Q2.', 'Q3.', 'Q4.', 'Q5.', 'Q6.', 'Q7.', 'Q8.', 'Q9.', 'Q10.']:
        matches = page.search_for(phrase)
        for m in matches:
            print(f'  Match "{phrase}": {m}')
    drawings = page.get_drawings()
    print(f'  Total drawings: {len(drawings)}')
    for d in drawings:
        r = d['rect']
        if r.width > 300 and r.height > 60:
            print(f'  Box Rect: {r}')
