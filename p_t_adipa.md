# Prueba Técnica — Desarrollador Full Stack

**Empresa:** ADIPA  
**Modalidad:** Take-home (remoto)  

---

## El desafío

Construye una aplicación web que permita subir un documento (PDF, Word o Excel) y retorne automáticamente las preguntas y alternativas detectadas, estructuradas en un JSON estandarizado.

### Ejemplo de salida esperada

```json
{
  "total_preguntas": 2,
  "preguntas": [
    {
      "numero": 1,
      "enunciado": "¿Cuál es el principal criterio diagnóstico del TAG?",
      "tipo": "seleccion_multiple",
      "alternativas": [
        { "letra": "A", "texto": "Alucinaciones visuales recurrentes" },
        { "letra": "B", "texto": "Preocupación excesiva difícil de controlar" },
        { "letra": "C", "texto": "Estado de ánimo persistentemente elevado" }
      ],
      "respuesta_correcta": "B"
    },
    {
      "numero": 2,
      "enunciado": "La terapia cognitivo-conductual es efectiva para el TAG.",
      "tipo": "verdadero_falso",
      "alternativas": [],
      "respuesta_correcta": "Verdadero"
    }
  ]
}
```

---

## Requerimientos

1. **Subida de archivos** — soportar PDF, `.docx` y `.xlsx`.
2. **Procesamiento** — extraer texto e identificar preguntas, tipo (selección múltiple, V/F, desarrollo, emparejamiento) y alternativas.
3. **Respuesta estructurada** — retornar el JSON según el esquema de arriba. Si la respuesta correcta está indicada en el documento, incluirla.
4. **Interfaz** — UI donde el usuario adjunta el archivo, inicia el procesamiento y visualiza o descarga el resultado.
5. **Manejo de errores** — informar si no se detectan preguntas, el formato es inválido o ocurre un error.

---

## Stack

| Capa | Requerido | Decisión libre |
|---|---|---|
| Frontend | React o Next.js | Estilos, librerías UI, estado |
| Backend | Python · FastAPI | Estructura, validación, logging |
| LLM / Extracción | Sin costo (free tier) | Modelo, proveedor, estrategia de prompting |
| Deploy | Producción (ver abajo) | Plataforma a elección |

Para el LLM puedes usar cualquier opción gratuita: Google Gemini (AI Studio), Groq, Mistral, modelos locales con Ollama, u otro enfoque sin costo.

---

## Deploy

La aplicación debe estar **desplegada y accesible públicamente**. La plataforma queda a tu elección (Vercel, Render, Railway, Fly.io, etc.).

Incluye la URL en el README.

---

## Entregables

- **Repositorio público** en GitHub con historial de commits limpio.
- **README** con instrucciones de instalación, variables de entorno necesarias y URL del deploy.
- **Carpeta `/examples`** con al menos un archivo de prueba y el JSON resultante.
- Compartir acceso al repositorio con **[@MatiasSantander](https://github.com/MatiasSantander)**.

---

## Consultas

Ante cualquier duda de interpretación, documenta tu supuesto en el README y avanza.  
Escríbenos a **matias.s@adipa.cl** con el asunto `Prueba Técnica – [Tu nombre]`.
