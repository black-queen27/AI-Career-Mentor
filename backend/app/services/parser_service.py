import os

from app.utils.pdf_parser import extract_pdf_text
from app.utils.docx_parser import extract_docx_text
from app.utils.txt_parser import extract_txt_text


def parse_resume(file_path):
    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".pdf":
        return extract_pdf_text(file_path)

    elif extension == ".docx":
        return extract_docx_text(file_path)

    elif extension == ".txt":
        return extract_txt_text(file_path)

    else:
        raise ValueError("Unsupported file format")