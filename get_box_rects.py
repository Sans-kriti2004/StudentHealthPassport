import fitz

doc = fitz.open(r'C:\Users\HP\Downloads\Medical-Grade+6+-+Student_Health_Passport_Team_Worksheet 2.pdf')

for i, page in enumerate(doc):
    print(f'=== PAGE {i+1} ===')
    matches = page.search_for('Type your answer here')
    for m in matches:
        print('  Placeholder Rect:', m)
    sketch_matches = page.search_for('Insert your sketch here')
    for m in sketch_matches:
        print('  Sketch Placeholder Rect:', m)
