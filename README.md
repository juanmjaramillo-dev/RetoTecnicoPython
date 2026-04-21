# Quiz Extractor

Aplicación web para extraer preguntas de documentos educativos (PDF, Word, Excel) y
retornarlas como JSON estructurado. Útil para digitalizar evaluaciones, cuestionarios
y exámenes sin necesidad de transcripción manual.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 · TypeScript · Tailwind CSS |
| Backend | Python 3.11+ · FastAPI · Uvicorn |
| Extracción de texto | pdfplumber · python-docx · openpyxl |
| Procesamiento LLM | Groq API — llama-3.3-70b-versatile (free tier) |

## Requisitos previos

- Node.js 18+ y npm
- Python 3.11+
- Cuenta en [Groq Console](https://console.groq.com) para obtener una API key (gratuita, sin tarjeta de crédito)

## Instalación local

### 1. Backend

```bash
cd backend

# Crear y activar entorno virtual
python -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env y completar GROQ_API_KEY con tu clave de Groq Console

# Iniciar servidor de desarrollo
uvicorn app.main:app --reload --port 8001
```

La documentación interactiva queda disponible en `http://localhost:8001/docs`.

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL ya apunta a http://localhost:8001 por defecto

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Variables de entorno

### Backend (`backend/.env`)

| Variable | Requerida | Descripción | Default |
|---|---|---|---|
| `GROQ_API_KEY` | **Sí** | API key de Groq Console | — |
| `GROQ_MODEL` | No | Modelo de Groq a usar | `llama-3.3-70b-versatile` |
| `FRONTEND_URL` | No | URL del frontend (CORS) | `http://localhost:3000` |
| `MAX_FILE_SIZE_MB` | No | Límite de tamaño de archivo | `15` |

### Frontend (`frontend/.env.local`)

| Variable | Requerida | Descripción | Default |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | URL base del backend | `http://localhost:8001` |

## Obtener la API key de Groq

1. Ve a [console.groq.com](https://console.groq.com) e inicia sesión (puedes usar tu cuenta de Google).
2. Haz clic en **API Keys** → **Create API Key**.
3. Copia la clave y agrégala en `backend/.env` como `GROQ_API_KEY=<tu_clave>`.

El plan gratuito incluye 100 solicitudes por día sin necesidad de tarjeta de crédito.

## Formatos soportados

| Formato | Extensión | Notas |
|---|---|---|
| PDF | `.pdf` | Solo PDFs con texto digital. Los PDFs escaneados (imágenes) no son soportados. |
| Word | `.docx` | Formato Office Open XML. No soporta `.doc` antiguo. |
| Excel | `.xlsx` | Lee todas las hojas. Las celdas se concatenan por fila. |

## Tipos de pregunta detectados

- `seleccion_multiple` — pregunta con opciones letradas o numeradas.
- `verdadero_falso` — afirmación que debe marcarse V o F.
- `desarrollo` — pregunta abierta sin alternativas predefinidas.
- `emparejamiento` — dos columnas de conceptos relacionados.

## Ejemplos

La carpeta `/examples` contiene:

- `generate_sample.py` — script para generar el documento de muestra (`muestra_preguntas.docx`).
  Ejecutar con `python examples/generate_sample.py` (requiere `pip install python-docx`).
- `muestra_preguntas_output.json` — salida JSON generada a partir del documento de muestra.

## Limitaciones conocidas

- Los PDFs generados por escáner (imágenes sin texto embebido) no son soportados porque
  la extracción de texto requiere contenido digital, no OCR.
- La detección de preguntas depende de la claridad del formato en el documento fuente.
  Documentos con formatos atípicos o muy densos pueden producir resultados parciales.
- El plan gratuito de Groq tiene un límite de 100 solicitudes por día.
