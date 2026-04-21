"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Pregunta, QuizResponse, TipoPregunta } from "@/types/quiz";

type Tab = "structured" | "json";

const TYPE_CONFIG: Record<
  TipoPregunta,
  { label: string; badge: string; border: string }
> = {
  seleccion_multiple: {
    label: "Selección múltiple",
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-blue-500",
  },
  verdadero_falso: {
    label: "Verdadero / Falso",
    badge: "bg-green-100 text-green-700",
    border: "border-l-green-500",
  },
  desarrollo: {
    label: "Desarrollo",
    badge: "bg-purple-100 text-purple-700",
    border: "border-l-purple-500",
  },
  emparejamiento: {
    label: "Emparejamiento",
    badge: "bg-orange-100 text-orange-700",
    border: "border-l-orange-500",
  },
};

function QuestionCard({ pregunta }: { pregunta: Pregunta }) {
  const config =
    TYPE_CONFIG[pregunta.tipo as TipoPregunta] ?? TYPE_CONFIG.desarrollo;

  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 border-l-4 ${config.border} p-5 shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
          {pregunta.numero}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${config.badge}`}
        >
          {config.label}
        </span>
      </div>

      <p className="text-slate-800 font-medium leading-relaxed">
        {pregunta.enunciado}
      </p>

      {pregunta.alternativas.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {pregunta.alternativas.map((alt) => {
            const isCorrect =
              pregunta.respuesta_correcta?.toUpperCase() ===
              alt.letra.toUpperCase();
            return (
              <li
                key={alt.letra}
                className={`flex items-start gap-2 text-sm px-3 py-1.5 rounded-md transition-colors ${
                  isCorrect
                    ? "bg-green-50 text-green-800"
                    : "text-slate-600"
                }`}
              >
                <span
                  className={`font-semibold shrink-0 w-4 ${
                    isCorrect ? "text-green-700" : "text-slate-400"
                  }`}
                >
                  {alt.letra}.
                </span>
                <span className="flex-1">{alt.texto}</span>
                {isCorrect && (
                  <svg
                    className="w-4 h-4 text-green-500 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {pregunta.tipo === "verdadero_falso" && pregunta.respuesta_correcta && (
        <div className="mt-3 flex items-center gap-1.5 text-sm">
          <span className="text-slate-500">Respuesta:</span>
          <span className="font-semibold text-green-700">
            {pregunta.respuesta_correcta}
          </span>
        </div>
      )}

      {pregunta.tipo === "desarrollo" && (
        <p className="mt-3 text-xs text-slate-400 italic">
          Pregunta de desarrollo — respuesta abierta
        </p>
      )}
    </div>
  );
}

interface Props {
  data: QuizResponse;
  filename: string;
  onReset: () => void;
}

export function ResultPanel({ data, filename, onReset }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("structured");

  const handleDownload = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${filename.replace(/\.[^.]+$/, "")}_quiz.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const tabBase =
    "px-4 py-2 text-sm font-medium border-b-2 transition-colors focus-visible:outline-none";
  const tabActive = "border-blue-600 text-blue-600";
  const tabInactive =
    "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300";

  return (
    <div>
      {/* Panel header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {data.total_preguntas} pregunta
            {data.total_preguntas !== 1 ? "s" : ""} detectada
            {data.total_preguntas !== 1 ? "s" : ""}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 truncate max-w-xs">
            {filename}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            Nueva extracción
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Descargar JSON
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveTab("structured")}
            className={`${tabBase} ${
              activeTab === "structured" ? tabActive : tabInactive
            }`}
          >
            Preguntas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={`${tabBase} ${
              activeTab === "json" ? tabActive : tabInactive
            }`}
          >
            JSON
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === "structured" ? (
        <div className="space-y-4">
          {data.preguntas.map((p) => (
            <QuestionCard key={p.numero} pregunta={p} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
          <SyntaxHighlighter
            language="json"
            style={oneLight}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.8125rem",
              lineHeight: "1.6",
            }}
            showLineNumbers
            lineNumberStyle={{ color: "#94a3b8", minWidth: "2.5em" }}
          >
            {JSON.stringify(data, null, 2)}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}
