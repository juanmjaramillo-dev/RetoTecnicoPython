import re
from typing import Optional

from pydantic import BaseModel, field_validator, model_validator


class Alternativa(BaseModel):
    letra: str
    texto: str

    @model_validator(mode="before")
    @classmethod
    def parse_string_form(cls, v: object) -> object:
        """Accept 'A) texto' or 'A. texto' in addition to the dict form."""
        if isinstance(v, str):
            m = re.match(r"^([A-Za-z\d]+)[).]\s*(.+)$", v.strip())
            if m:
                return {"letra": m.group(1).upper(), "texto": m.group(2).strip()}
            return {"letra": "?", "texto": v.strip()}
        return v


class Pregunta(BaseModel):
    numero: Optional[int] = None
    enunciado: str
    tipo: str
    alternativas: list[Alternativa] = []
    respuesta_correcta: Optional[str] = None

    @field_validator("respuesta_correcta", mode="before")
    @classmethod
    def normalize_respuesta(cls, v: object) -> Optional[str]:
        if v in (None, "", "null", "None", "N/A", "n/a", "ninguna"):
            return None
        return str(v)

    @field_validator("tipo", mode="before")
    @classmethod
    def normalize_tipo(cls, v: object) -> str:
        valid = {"seleccion_multiple", "verdadero_falso", "desarrollo", "emparejamiento"}
        s = str(v).lower().strip()
        if s not in valid:
            return "desarrollo"
        return s


class QuizResponse(BaseModel):
    total_preguntas: int = 0
    preguntas: list[Pregunta] = []

    @model_validator(mode="after")
    def sync_total_and_numbers(self) -> "QuizResponse":
        # Assign sequential numbers to questions that lack one
        for i, p in enumerate(self.preguntas, start=1):
            if p.numero is None:
                p.numero = i
        self.total_preguntas = len(self.preguntas)
        return self
