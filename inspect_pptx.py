import pptx

prs = pptx.Presentation(r'C:\Users\HP\Downloads\PPT_Template_Grade6_Medical_StudentHealthPassport.pptx')
with open(r'C:\Users\HP\Desktop\StudentHealthPassport\pptx_structure.txt', 'w', encoding='utf-8') as f:
    for idx, slide in enumerate(prs.slides):
        f.write(f'==============================\nSLIDE {idx+1}\n==============================\n')
        for s_idx, shape in enumerate(slide.shapes):
            f.write(f'Shape {s_idx}: name="{shape.name}", type={shape.shape_type}, left={shape.left}, top={shape.top}, width={shape.width}, height={shape.height}\n')
            if shape.has_text_frame:
                full_text = '\n'.join([p.text for p in shape.text_frame.paragraphs])
                f.write(f'  TextFrame:\n{full_text}\n')
            if shape.has_table:
                f.write(f'  Table ({len(shape.table.rows)} rows x {len(shape.table.columns)} cols):\n')
                for r_idx, row in enumerate(shape.table.rows):
                    row_txt = [cell.text.replace('\n', ' ') for cell in row.cells]
                    f.write(f'    Row {r_idx}: {row_txt}\n')
print('PPTX structure saved successfully')
