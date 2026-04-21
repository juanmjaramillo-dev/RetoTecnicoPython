"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/FileDropzone";
import { ResultPanel } from "@/components/ResultPanel";
import { ErrorBanner } from "@/components/ErrorBanner";
import { parseDocument } from "@/lib/api";
import type { QuizResponse } from "@/types/quiz";

type AppState =
  | { status: "idle" }
  | { status: "uploading"; filename: string }
  | { status: "success"; data: QuizResponse; filename: string }
  | { status: "error"; message: string };

export default function Home() {
  const [state, setState] = useState<AppState>({ status: "idle" });

  const handleProcess = async (file: File) => {
    setState({ status: "uploading", filename: file.name });
    try {
      const data = await parseDocument(file);
      if (data.total_preguntas === 0) {
        setState({
          status: "error",
          message:
            "No se detectaron preguntas en el documento. Asegúrate de subir un examen o cuestionario.",
        });
      } else {
        setState({ status: "success", data, filename: file.name });
      }
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Error desconocido.",
      });
    }
  };

  const handleReset = () => setState({ status: "idle" });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
            Quiz Extractor
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Sube un documento y obtén sus preguntas en formato JSON
            estructurado.
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:px-6">
        {state.status === "success" ? (
          <ResultPanel
            data={state.data}
            filename={state.filename}
            onReset={handleReset}
          />
        ) : (
          <div className="max-w-xl mx-auto space-y-4">
            {state.status === "uploading" && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                Procesando {state.filename}. Esto puede tardar algunos segundos según el tamaño del archivo.
              </div>
            )}
            <FileDropzone
              onProcess={handleProcess}
              isLoading={state.status === "uploading"}
            />
            {state.status === "error" && (
              <ErrorBanner message={state.message} onDismiss={handleReset} />
            )}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>Quiz Extractor — Prueba Técnica ADIPA</span>
          <span>Powered by Groq · llama-3.3-70b-versatile</span>
        </div>
      </footer>
    </div>
  );
}

