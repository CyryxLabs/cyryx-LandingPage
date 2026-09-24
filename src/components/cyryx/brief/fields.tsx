import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
import { Plus, X } from "lucide-react";

/** Controlled form primitives for the project brief. Same look as /start. */

export const INPUT_CLASS =
  "mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-4 py-3 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)] aria-[invalid=true]:border-red-400/60";

export function FieldLabel({
  children,
  required,
  hint,
  htmlFor,
}: {
  children: ReactNode;
  required?: boolean;
  hint?: string;
  htmlFor?: string;
}) {
  return (
    <span className="block">
      <label
        htmlFor={htmlFor}
        className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--silver)]"
      >
        {children}
        {required ? (
          <span aria-hidden className="ml-1 text-[var(--accent-glow)]">
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <span className="mt-1 block text-[13px] text-[var(--silver-dim)]">{hint}</span>
      ) : null}
    </span>
  );
}

function ErrorText({ id, error }: { id: string; error?: string }) {
  return error ? (
    <span id={id} className="mt-2 block text-sm text-red-300">
      {error}
    </span>
  ) : null;
}

export function TextInput({
  label,
  value,
  onChange,
  required,
  hint,
  placeholder,
  type = "text",
  autoComplete,
  error,
  maxLength = 200,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  maxLength?: number;
  name?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={INPUT_CLASS}
      />
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  required,
  hint,
  placeholder,
  rows = 4,
  error,
  maxLength = 4000,
  name,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  rows?: number;
  error?: string;
  maxLength?: number;
  name?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} required={required} hint={hint}>
        {label}
      </FieldLabel>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${INPUT_CLASS} resize-y leading-relaxed`}
      />
      <span className="mt-1 flex justify-end font-mono text-[11px] text-[var(--steel)]">
        {value.length > maxLength * 0.8 ? `${value.length}/${maxLength}` : ""}
      </span>
      <ErrorText id={`${id}-error`} error={error} />
    </div>
  );
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  hint,
  placeholder = "Select…",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  hint?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={INPUT_CLASS}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Single or multiple choice as toggle chips (keyboard and screen-reader friendly). */
export function ChipGroup({
  label,
  options,
  value,
  onChange,
  multiple = false,
  hint,
}: {
  label: string;
  options: readonly string[];
  value: string[];
  onChange: (value: string[]) => void;
  multiple?: boolean;
  hint?: string;
}) {
  const id = useId();
  const toggle = (option: string) => {
    if (multiple) {
      onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
    } else {
      onChange(value[0] === option ? [] : [option]);
    }
  };
  return (
    <fieldset aria-describedby={hint ? `${id}-hint` : undefined}>
      <legend className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--silver)]">
        {label}
      </legend>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-[13px] text-[var(--silver-dim)]">
          {hint}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option)}
              className={`min-h-11 rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] ${
                selected
                  ? "border-[var(--accent-glow)] bg-[color-mix(in_oklab,var(--accent-glow)_14%,transparent)] text-[var(--silver)]"
                  : "border-white/15 text-[var(--silver-dim)] hover:border-white/30 hover:text-[var(--silver)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/** A list of short strings: type and press Enter (or Add) to append. */
export function ListInput({
  label,
  values,
  onChange,
  placeholder,
  hint,
  max = 12,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
  max?: number;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = () => {
    const value = draft.trim();
    if (!value || values.length >= max) return;
    onChange([...values, value.slice(0, 300)]);
    setDraft("");
  };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      add();
    }
  };
  return (
    <div>
      <FieldLabel htmlFor={id} hint={hint}>
        {label}
      </FieldLabel>
      {values.length ? (
        <ul className="mt-3 grid gap-2">
          {values.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="flex items-start justify-between gap-3 rounded-md border border-white/10 bg-[var(--onyx)] px-3 py-2 text-sm text-[var(--silver)]"
            >
              <span className="min-w-0 break-words">{value}</span>
              <button
                type="button"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                aria-label={`Remove ${value}`}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-[var(--steel)] hover:text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-2 flex gap-2">
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          maxLength={300}
          disabled={values.length >= max}
          className={`${INPUT_CLASS} mt-0`}
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim() || values.length >= max}
          className="cx-btn-secondary cx-btn-sm shrink-0 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </button>
      </div>
    </div>
  );
}

/** Repeating group of fields (personas, features, integrations, stakeholders). */
export function Repeater<T>({
  label,
  hint,
  items,
  onChange,
  create,
  render,
  addLabel,
  max = 20,
  itemLabel,
}: {
  label: string;
  hint?: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel: string;
  max?: number;
  itemLabel: (item: T, index: number) => string;
}) {
  return (
    <fieldset>
      <legend className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--silver)]">
        {label}
      </legend>
      {hint ? <p className="mt-1 text-[13px] text-[var(--silver-dim)]">{hint}</p> : null}
      <div className="mt-3 grid gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="cx-spotlight rounded-lg border border-white/10 bg-[var(--onyx)] p-4 sm:p-5"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent-glow)]">
                {itemLabel(item, index)}
              </span>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                aria-label={`Remove ${itemLabel(item, index)}`}
                className="inline-flex min-h-9 items-center gap-1 rounded px-2 text-xs text-[var(--steel)] hover:text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
              >
                <X className="h-3.5 w-3.5" aria-hidden /> Remove
              </button>
            </div>
            {render(
              item,
              (patch) =>
                onChange(
                  items.map((current, i) => (i === index ? { ...current, ...patch } : current)),
                ),
              index,
            )}
          </div>
        ))}
      </div>
      {items.length < max ? (
        <button
          type="button"
          onClick={() => onChange([...items, create()])}
          className="cx-btn-secondary cx-btn-sm mt-3"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {addLabel}
        </button>
      ) : null}
    </fieldset>
  );
}
