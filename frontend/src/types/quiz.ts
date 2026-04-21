export interface Alternativa {
  letra: string;
  texto: string;
}

export type TipoPregunta =
  | "seleccion_multiple"
  | "verdadero_falso"
  | "desarrollo"
  | "emparejamiento";

export interface Pregunta {
  numero: number;
  enunciado: string;
  tipo: TipoPregunta;
  alternativas: Alternativa[];
  respuesta_correcta: string | null;
}

export interface QuizResponse {
  total_preguntas: number;
  preguntas: Pregunta[];
}
