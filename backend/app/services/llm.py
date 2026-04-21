import json

from groq import Groq

from app.core.config import settings
from app.schemas.quiz import QuizResponse

_SYSTEM_PROMPT = """
Eres un extractor especializado en documentos educativos: exámenes, cuestionarios y evaluaciones.
Tu única tarea es analizar el texto proporcionado e identificar todas las preguntas presentes,
estructurándolas EXACTAMENTE en el siguiente formato JSON.

ESQUEMA DE SALIDA (sigue este formato sin excepciones):
{
  "total_preguntas": <número entero>,
  "preguntas": [
    {
      "numero": <número entero, empezando en 1>,
      "enunciado": "<texto de la pregunta sin prefijo de numeración>",
      "tipo": "<seleccion_multiple | verdadero_falso | desarrollo | emparejamiento>",
      "alternativas": [
        { "letra": "A", "texto": "<texto de la alternativa>" },
        { "letra": "B", "texto": "<texto de la alternativa>" }
      ],
      "respuesta_correcta": "<letra o texto, o null si no está indicada>"
    }
  ]
}

TIPOS DE PREGUNTA:
- seleccion_multiple: pregunta con opciones letradas o numeradas (A/B/C, 1/2/3, a/b/c).
- verdadero_falso: afirmación que el evaluado debe marcar como Verdadero o Falso.
- desarrollo: pregunta abierta sin alternativas predefinidas.
- emparejamiento: dos columnas de conceptos que se relacionan entre sí.

REGLAS ESTRICTAS:
1. El campo "numero" es SIEMPRE un entero. Detecta el número aunque el formato sea "1.", "1)", "(1)", "Pregunta 1:", etc.
   Si no hay numeración, asigna números secuenciales empezando en 1.
2. El campo "alternativas" es SIEMPRE una lista de objetos {"letra": "A", "texto": "..."}. NUNCA una lista de strings.
   Normaliza las letras a mayúsculas (A, B, C…).
3. Para verdadero_falso: alternativas = [].
4. Para desarrollo: alternativas = [], respuesta_correcta = null.
5. Para emparejamiento: cada par es {"letra": "A", "texto": "Concepto → Definición"}.
6. Si la respuesta correcta aparece marcada (asterisco, [X], "Resp:", "Clave:", "Correcta:", etc.),
   ponla en "respuesta_correcta". Si no, respuesta_correcta = null.
7. El enunciado NO debe incluir el prefijo de numeración.
8. Si no hay preguntas, retorna {"total_preguntas": 0, "preguntas": []}.
9. Responde ÚNICAMENTE con el JSON. Sin explicaciones ni texto adicional.
""".strip()


def parse_questions(text: str) -> QuizResponse:
    client = Groq(api_key=settings.groq_api_key)

    completion = client.chat.completions.create(
        model=settings.groq_model,
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": text},
        ],
        response_format={"type": "json_object"},
        temperature=0.1,
    )

    raw = completion.choices[0].message.content or ""

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"El modelo retornó JSON malformado: {exc}") from exc

    return QuizResponse.model_validate(data)
