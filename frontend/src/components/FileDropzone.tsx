"use client";

import { useCallback, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";

const ACCEPTED_TYPES: Record<string, string[]> = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
};

const MAX_SIZE_BYTES = 15 * 1024 * 1024;

interface Props {
  onProcess: (file: File) => void;
  isLoading: boolean;
}

export function FileDropzone({ onProcess, isLoading }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      setValidationError(null);

      if (rejected.length > 0) {
        const code = rejected[0].errors[0]?.code;
        if (code === "file-too-large") {
          setValidationError("El archivo supera el límite de 15 MB.");
        } else if (code === "file-invalid-type") {
          setValidationError(
            "Formato no soportado. Usa archivos PDF, DOCX o XLSX."
          );
        } else {
          setValidationError(rejected[0].errors[0]?.message ?? "Archivo no válido.");
        }
        setFile(null);
        return;
      }

      if (accepted.length > 0) {
        setFile(accepted[0]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_BYTES,
    multiple: false,
    disabled: isLoading,
  });

  const handleSubmit = () => {
    if (file && !isLoading) onProcess(file);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={[
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed",
          "p-12 cursor-pointer transition-colors duration-200 outline-none",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50",
          isLoading ? "opacity-60 pointer-events-none" : "",
        ].join(" ")}
      >
        <input {...getInputProps()} />

        {isLoading ? (
          <div className="text-center">
            <svg
              className="w-9 h-9 animate-spin text-blue-500 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="font-medium text-slate-700">Procesando documento…</p>
            <p className="text-sm text-slate-500 mt-1">
              Extrayendo texto y analizando preguntas con IA
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 rounded-full bg-slate-100">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            {isDragActive ? (
              <p className="text-blue-600 font-medium">Suelta el archivo aquí</p>
            ) : file ? (
              <div className="text-center">
                <p className="font-medium text-slate-800">{file.name}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Haz clic o arrastra otro archivo para reemplazar
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium text-slate-700">
                  Arrastra tu archivo aquí
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  o haz clic para seleccionar
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  PDF · DOCX · XLSX — máximo 15 MB
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {validationError && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!file || isLoading}
        className="mt-4 w-full py-3 px-6 rounded-lg font-medium text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Procesando…
          </span>
        ) : (
          "Extraer preguntas"
        )}
      </button>
    </div>
  );
}
