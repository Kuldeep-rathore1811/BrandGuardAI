from fastapi import FastAPI, HTTPException
from database import get_connection
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File
from document_utils import extract_text, extract_images
from compliance_utils import check_compliance
from psycopg.types.json import Jsonb
from visual_utils import analyze_image_colors
from logo_utils import verify_logo

app = FastAPI(
    title="BrandGuard AI",
    description="Backend for the BrandGuard AI platform",
    version="1.0.0"
)
# Allow frontend to communicate with backend

app.add_middleware(
    CORSMiddleware,
    =["http://localhostallow_origins:3000",
        "https://brand-guard-ai-one.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Structure of the brand guidelines received from the frontend
class BrandGuidelines(BaseModel):
    company_name: str
    brand_description: Optional[str] = None
    brand_tone: Optional[str] = None
    approved_terminology: Optional[str] = None
    restricted_terminology: Optional[str] = None
    visual_guidelines: Optional[str] = None

# API to save brand guidelines
@app.post("/guidelines")
def save_guidelines(guidelines: BrandGuidelines):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                INSERT INTO brand_guidelines (
                    company_name,
                    brand_description,
                    brand_tone,
                    approved_terminology,
                    restricted_terminology,
                    visual_guidelines
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (
                    guidelines.company_name,
                    guidelines.brand_description,
                    guidelines.brand_tone,
                    guidelines.approved_terminology,
                    guidelines.restricted_terminology,
                    guidelines.visual_guidelines
                )
            )

            guideline_id = cursor.fetchone()[0]

        connection.commit()

        return {
            "message": "Brand guidelines saved successfully!",
            "guideline_id": guideline_id
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()

# API to retrieve all brand guidelines
@app.get("/guidelines")
def get_guidelines():

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT * FROM brand_guidelines
                ORDER BY id DESC;
                """
            )

            records = cursor.fetchall()

            guidelines_list = []

            for record in records:
                guidelines_list.append({
                    "id": record[0],
                    "company_name": record[1],
                    "brand_description": record[2],
                    "brand_tone": record[3],
                    "approved_terminology": record[4],
                    "restricted_terminology": record[5],
                    "visual_guidelines": record[6],
                    "created_at": record[7]
                })

        return guidelines_list

    finally:
        connection.close()


# API to update existing brand guidelines
@app.put("/guidelines/{guideline_id}")
def update_guidelines(
    guideline_id: int,
    guidelines: BrandGuidelines
):

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                UPDATE brand_guidelines
                SET
                    company_name = %s,
                    brand_description = %s,
                    brand_tone = %s,
                    approved_terminology = %s,
                    restricted_terminology = %s,
                    visual_guidelines = %s
                WHERE id = %s
                RETURNING id;
                """,
                (
                    guidelines.company_name,
                    guidelines.brand_description,
                    guidelines.brand_tone,
                    guidelines.approved_terminology,
                    guidelines.restricted_terminology,
                    guidelines.visual_guidelines,
                    guideline_id
                )
            )

            updated_record = cursor.fetchone()

            if updated_record is None:
                raise HTTPException(
                    status_code=404,
                    detail="Guidelines not found"
                )

        connection.commit()

        return {
            "message": "Brand guidelines updated successfully!",
            "guideline_id": updated_record[0]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


@app.post("/upload-document")
async def upload_document(file: UploadFile = File(...)):

    filename = file.filename or ""
    file_extension = filename.lower().rsplit(".", 1)[-1]

    if file_extension not in ["pdf", "docx"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    file_content = await file.read()

    if not file_content:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty."
        )

    connection = None
    cursor = None

    try:
        # Extract text
        extracted_text = extract_text(
            file_content,
            "." + file_extension
        )

        # Extract images
        extracted_images = extract_images(
            file_content,
            "." + file_extension
        )

        image_count = len(extracted_images)

        # Connect to database
        connection = get_connection()
        cursor = connection.cursor()

        # Save document
        cursor.execute(
            """
            INSERT INTO uploaded_documents
            (filename, file_type, extracted_text)
            VALUES (%s, %s, %s)
            RETURNING id
            """,
            (filename, file_extension, extracted_text)
        )

        document_id = cursor.fetchone()[0]

        # Save every extracted image
        for image in extracted_images:

            cursor.execute(
                """
                INSERT INTO document_images
                (document_id, image_data, image_extension, page_number)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    document_id,
                    image["image_bytes"],
                    image["extension"],
                    image["page"]
                )
            )

        connection.commit()

        return {
            "message": "Document uploaded successfully!",
            "document_id": document_id,
            "filename": filename,
            "file_type": file_extension,
            "extracted_text": extracted_text,
            "image_count": image_count
        }

    except Exception as error:

        if connection:
            connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.post("/analyze-document/{document_id}")
def analyze_document(document_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        # 1. Get uploaded document
        cursor.execute(
            """
            SELECT id, filename, extracted_text
            FROM uploaded_documents
            WHERE id = %s
            """,
            (document_id,)
        )

        document = cursor.fetchone()

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found"
            )

        # 2. Get latest brand guidelines
        cursor.execute(
            """
            SELECT company_name, brand_description, brand_tone,
                   approved_terminology, restricted_terminology,
                   visual_guidelines
            FROM brand_guidelines
            ORDER BY id DESC
            LIMIT 1
            """
        )

        guideline = cursor.fetchone()

        if not guideline:
            raise HTTPException(
                status_code=404,
                detail="Brand guidelines not found"
            )

        guidelines = {
            "company_name": guideline[0],
            "brand_description": guideline[1],
            "brand_tone": guideline[2],
            "approved_terminology": guideline[3],
            "restricted_terminology": guideline[4],
            "visual_guidelines": guideline[5]
        }

        # 3. Run text compliance analysis
        result = check_compliance(
            document[2] or "",
            guidelines
        )

        # 4. Get stored document images
        cursor.execute(
            """
            SELECT id, image_data, page_number
            FROM document_images
            WHERE document_id = %s
            """,
            (document_id,)
        )

        images = cursor.fetchall()

        visual_results = []
        visual_issues = []
        logo_results = []

        # 5. Analyse image colours
        for image in images:

            visual_result = analyze_image_colors(
                image[1],
                guidelines["visual_guidelines"]
            )

            visual_result["image_id"] = image[0]
            visual_result["page_number"] = image[2]

            visual_results.append(visual_result)

            # 6. Verify logo
            logo_result = verify_logo(image[1])

            logo_result["image_id"] = image[0]
            logo_result["page_number"] = image[2]

            logo_results.append(logo_result)

            # 7. Record potential colour mismatches
            for mismatch in visual_result.get("mismatches", []):

                visual_issues.append({
                    "type": "Visual Brand Color",
                    "severity": "Medium",
                    "word": str(mismatch["rgb"]),
                    "message": "A dominant image colour may not match the approved brand colours.",
                    "suggestion": "Review this image against the approved brand colour guidelines."
                })

        # 7. Combine text and visual results
        result["issues"].extend(visual_issues)

        result["total_issues"] += len(visual_issues)

        result["compliance_score"] = max(
            0,
            result["compliance_score"] - (len(visual_issues) * 10)
        )

        result["visual_analysis"] = visual_results
        result["logo_analysis"] = logo_results


        # 8. Save analysis in PostgreSQL
        cursor.execute(
            """
            INSERT INTO analysis_history
            (document_id, compliance_score, total_issues, analysis_result)
            VALUES (%s, %s, %s, %s)
            RETURNING id
            """,
            (
                document[0],
                result["compliance_score"],
                result["total_issues"],
                Jsonb(result)
            )
        )

        analysis_id = cursor.fetchone()[0]

        connection.commit()

        # 9. Return complete analysis
        return {
            "analysis_id": analysis_id,
            "document_id": document[0],
            "filename": document[1],
            "company_name": guidelines["company_name"],
            "compliance_score": result["compliance_score"],
            "total_issues": result["total_issues"],
            "issues": result["issues"],
            "visual_analysis": visual_results,
            "logo_analysis": logo_results
        }

    except HTTPException:
        connection.rollback()
        raise

    except Exception as error:
        connection.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    finally:
        cursor.close()
        connection.close()

@app.get("/analysis-history")
def get_analysis_history():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT
                ah.id,
                ah.document_id,
                ud.filename,
                ah.compliance_score,
                ah.total_issues,
                ah.analysis_result,
                ah.analyzed_at
            FROM analysis_history ah
            JOIN uploaded_documents ud
            ON ah.document_id = ud.id
            ORDER BY ah.analyzed_at DESC
            """
        )

        records = cursor.fetchall()

        history = []

        for record in records:
            history.append({
                "analysis_id": record[0],
                "document_id": record[1],
                "filename": record[2],
                "compliance_score": record[3],
                "total_issues": record[4],
                "analysis_result": record[5],
                "analyzed_at": record[6].isoformat()
            })

        return history

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

    finally:
        cursor.close()
        connection.close()        

@app.get("/")
def home():
    return {
        "message": "Welcome to BrandGuard AI Backend!",
        "status": "Running successfully"
    }

@app.get("/health")
def health_check():
    return {
        "status": "Healthy",
        "application": "BrandGuard AI"
    }

# Test PostgreSQL connection through FastAPI
@app.get("/database-status")
def database_status():

    try:
        connection = get_connection()
        connection.close()

        return {
            "database": "Connected",
            "status": "Successfully connected to PostgreSQL"
        }

    except Exception as error:
        return {
            "database": "Disconnected",
            "error": str(error)
        }
