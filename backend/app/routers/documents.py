from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.core.config import settings
from app.schemas.quiz import QuizResponse
from app.services import extractor as ext_svc
from app.services import llm as llm_svc

router = APIRouter(prefix="/api/v1", tags=["documents"])

_ALLOWED_EXTENSIONS = {".pdf", ".docx", ".xlsx"}
_MAX_BYTES = settings.max_file_size_mb * 1024 * 1024


@router.get("/health", include_in_schema=False)
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.post(
    "/parse",
    response_model=QuizResponse,
    status_code=status.HTTP_200_OK,
    summary="Extrae preguntas de un documento",
    description=(
        "Recibe un archivo PDF, DOCX o XLSX y retorna las preguntas detectadas "
        "estructuradas en JSON."
    ),
)
async def parse_document(file: UploadFile = File(...)) -> QuizResponse:
    filename = file.filename or ""
    ext = ("." + filename.rsplit(".", 1)[-1].lower()) if "." in filename else ""

    if ext not in _ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Formato no soportado. Se aceptan archivos PDF, DOCX y XLSX.",
        )

    data = await file.read()

    if not data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="El archivo está vacío.",
        )

    if len(data) > _MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"El archivo supera el límite de {settings.max_file_size_mb} MB.",
        )

    try:
        text = ext_svc.extract_text(file, data)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"No se pudo extraer texto del archivo: {exc}",
        ) from exc

    if not text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "El archivo no contiene texto extraíble. "
                "Los PDFs generados por escáner (imágenes) no están soportados."
            ),
        )

    try:
        result = llm_svc.parse_questions(text)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error al procesar con el modelo de lenguaje: {exc}",
        ) from exc

    return result
