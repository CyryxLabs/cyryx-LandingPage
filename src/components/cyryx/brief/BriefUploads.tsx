import { useEffect, useId, useMemo, useRef, useState, type DragEvent } from "react";
import { FileText, ImageIcon, UploadCloud, X } from "lucide-react";
import {
  ATTACHMENT_MIME_TYPES,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS,
  MAX_TOTAL_ATTACHMENT_BYTES,
} from "@/lib/brief.schema";
import { INPUT_CLASS } from "./fields";

export type BriefFile = {
  id: string;
  file: File;
  caption: string;
  /** 0–100 while uploading, 100 when stored. */
  progress?: number;
  error?: string;
};

const EXTENSION_MIME: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  md: "text/markdown",
  csv: "text/csv",
};

/** Browsers report some types inconsistently (e.g. .md, .csv); fall back to the extension. */
export function mimeFor(file: File): string {
  if ((ATTACHMENT_MIME_TYPES as readonly string[]).includes(file.type)) return file.type;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_MIME[extension] ?? file.type ?? "";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Thumb({ file }: { file: File }) {
  const url = useMemo(
    () => (file.type.startsWith("image/") ? URL.createObjectURL(file) : null),
    [file],
  );
  useEffect(() => () => (url ? URL.revokeObjectURL(url) : undefined), [url]);
  if (url) {
    return (
      <img
        src={url}
        alt=""
        className="h-16 w-16 shrink-0 rounded-md border border-white/10 object-cover"
      />
    );
  }
  return (
    <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[var(--graphite)]">
      <FileText className="h-6 w-6 text-[var(--steel)]" aria-hidden />
    </span>
  );
}

export function BriefUploads({
  files,
  onChange,
  disabled,
}: {
  files: BriefFile[];
  onChange: (files: BriefFile[]) => void;
  disabled?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const addFiles = (incoming: FileList | File[]) => {
    const next = [...files];
    const rejected: string[] = [];
    let total = next.reduce((sum, f) => sum + f.file.size, 0);
    for (const file of Array.from(incoming)) {
      if (next.length >= MAX_ATTACHMENTS) {
        rejected.push(`${file.name} (limit of ${MAX_ATTACHMENTS} files)`);
        continue;
      }
      if (!(ATTACHMENT_MIME_TYPES as readonly string[]).includes(mimeFor(file))) {
        rejected.push(`${file.name} (file type not supported)`);
        continue;
      }
      if (file.size > MAX_ATTACHMENT_BYTES) {
        rejected.push(`${file.name} (over 25 MB)`);
        continue;
      }
      if (total + file.size > MAX_TOTAL_ATTACHMENT_BYTES) {
        rejected.push(`${file.name} (over 100 MB in total)`);
        continue;
      }
      if (next.some((f) => f.file.name === file.name && f.file.size === file.size)) continue;
      total += file.size;
      next.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file, caption: "" });
    }
    setNotice(rejected.length ? `Not added: ${rejected.join("; ")}.` : null);
    onChange(next);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled && event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
  };

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--silver)]">
        Files and images
      </p>
      <p className="mt-1 text-[13px] text-[var(--silver-dim)]">
        Wireframes, screenshots, specs, spreadsheets, process diagrams, brand guides. PDF, images,
        Word, Excel, PowerPoint, text or CSV. Up to {MAX_ATTACHMENTS} files, 25 MB each.
      </p>
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mt-3 flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-[var(--accent-glow)] ${
          dragging
            ? "border-[var(--accent-glow)] bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)]"
            : "border-white/20 bg-[color-mix(in_oklab,var(--graphite)_45%,transparent)] hover:border-white/35"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
      >
        <UploadCloud className="h-7 w-7 text-[var(--accent-glow)]" aria-hidden />
        <span className="text-sm text-[var(--silver)]">
          Drop files here or <span className="text-[var(--accent-glow)] underline">browse</span>
        </span>
        <span className="text-xs text-[var(--steel)]">
          You can also paste a screenshot anywhere on this step
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.xlsx,.pptx,.txt,.md,.csv"
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </label>
      <PasteListener onFiles={addFiles} disabled={disabled} />
      {notice ? (
        <p role="status" className="mt-2 text-sm text-[#d3b36a]">
          {notice}
        </p>
      ) : null}
      {files.length ? (
        <ul className="mt-4 grid gap-3">
          {files.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-3 rounded-lg border border-white/10 bg-[var(--onyx)] p-3 sm:flex-row sm:items-start"
            >
              <Thumb file={item.file} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 break-all text-sm text-[var(--silver)]">
                    {item.file.type.startsWith("image/") ? (
                      <ImageIcon
                        className="mr-1.5 inline h-3.5 w-3.5 text-[var(--steel)]"
                        aria-hidden
                      />
                    ) : null}
                    {item.file.name}
                    <span className="ml-2 font-mono text-[12px] text-[var(--steel)]">
                      {formatBytes(item.file.size)}
                    </span>
                  </p>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(files.filter((f) => f.id !== item.id))}
                    aria-label={`Remove ${item.file.name}`}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded text-[var(--steel)] hover:text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] disabled:opacity-40"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>
                <input
                  value={item.caption}
                  onChange={(event) =>
                    onChange(
                      files.map((f) =>
                        f.id === item.id ? { ...f, caption: event.target.value } : f,
                      ),
                    )
                  }
                  maxLength={300}
                  disabled={disabled}
                  aria-label={`What is ${item.file.name}?`}
                  placeholder="What is this? (e.g. current checkout flow, target dashboard)"
                  className={`${INPUT_CLASS} mt-2 py-2`}
                />
                {typeof item.progress === "number" ? (
                  <div className="mt-2 h-1 overflow-hidden rounded bg-white/10" aria-hidden>
                    <div
                      className="h-full bg-[var(--accent-glow)] transition-[width]"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                ) : null}
                {item.error ? <p className="mt-2 text-sm text-red-300">{item.error}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Lets visitors paste screenshots straight from the clipboard. */
function PasteListener({
  onFiles,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  useEffect(() => {
    if (disabled) return;
    const onPaste = (event: ClipboardEvent) => {
      const items = Array.from(event.clipboardData?.files ?? []);
      if (!items.length) return;
      const images = items.map((file, index) =>
        file.name && file.name !== "image.png"
          ? file
          : new File([file], `pasted-screenshot-${Date.now()}-${index + 1}.png`, {
              type: file.type || "image/png",
            }),
      );
      onFiles(images);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [onFiles, disabled]);
  return null;
}
