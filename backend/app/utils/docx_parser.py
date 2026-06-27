from docx import Document


def extract_docx_text(file_path):
    document = Document(file_path)

    text = []

    for para in document.paragraphs:
        text.append(para.text)

    return "\n".join(text)