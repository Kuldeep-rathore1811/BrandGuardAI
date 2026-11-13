
from io import BytesIO

import pymupdf
import pytesseract

from PIL import Image
from docx import Document


# Tesseract installation path on Windows
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# 1. Extract text from PDF and DOCX files
def extract_text(file_content, file_extension):

    if file_extension == ".pdf":

        pdf_document = pymupdf.open(
            stream=file_content,
            filetype="pdf"
        )

        extracted_text = ""

        try:
            for page in pdf_document:

                # First try normal PDF text extraction
                page_text = page.get_text().strip()

                # If no selectable text exists, use OCR
                if not page_text:

                    pixmap = page.get_pixmap(
                        matrix=pymupdf.Matrix(2, 2),
                        alpha=False
                    )

                    image = Image.open(
                        BytesIO(pixmap.tobytes("png"))
                    )

                    page_text = pytesseract.image_to_string(
                        image,
                        lang="eng"
                    ).strip()

                extracted_text += page_text + "\n"

        finally:
            pdf_document.close()

        return extracted_text

    elif file_extension == ".docx":

        word_document = Document(BytesIO(file_content))

        extracted_text = ""

        for paragraph in word_document.paragraphs:
            extracted_text += paragraph.text + "\n"

        return extracted_text

    else:
        raise ValueError(
            "Only PDF and DOCX files are supported."
        )


# 2. Extract images from PDF and DOCX files
def extract_images(file_content, file_extension):

    extracted_images = []

    if file_extension == ".pdf":

        pdf_document = pymupdf.open(
            stream=file_content,
            filetype="pdf"
        )

        try:
            for page_number, page in enumerate(pdf_document):

                images = page.get_images(full=True)

                for image_info in images:

                    image_xref = image_info[0]

                    image_data = pdf_document.extract_image(
                        image_xref
                    )

                    extracted_images.append({
                        "image_bytes": image_data["image"],
                        "extension": image_data["ext"],
                        "page": page_number + 1
                    })

        finally:
            pdf_document.close()

    elif file_extension == ".docx":

        word_document = Document(BytesIO(file_content))

        for relationship in word_document.part.rels.values():

            if "image" in relationship.reltype:

                image_part = relationship.target_part

                extracted_images.append({
                    "image_bytes": image_part.blob,
                    "extension": image_part.content_type.split("/")[-1],
                    "page": None
                })

    else:
        raise ValueError(
            "Only PDF and DOCX files are supported."
        )

    return extracted_images
