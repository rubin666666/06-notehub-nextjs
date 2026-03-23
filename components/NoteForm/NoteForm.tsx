"use client";

import { useState } from "react";
import { NOTE_TAGS, type NewNoteData, type NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

type NoteFormProps = {
  onSubmit: (payload: NewNoteData) => Promise<unknown>;
  onCancel: () => void;
};

export function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState<NoteTag>("Todo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        tag,
      });
    } catch {
      setError("Failed to create note.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <label className={css.formGroup}>
        Title
        <input
          className={css.input}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>

      <label className={css.formGroup}>
        Content
        <textarea
          className={css.textarea}
          rows={5}
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
      </label>

      <label className={css.formGroup}>
        Tag
        <select
          className={css.select}
          value={tag}
          onChange={(event) => setTag(event.target.value as NoteTag)}
        >
          {NOTE_TAGS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      {error ? <p className={css.error}>{error}</p> : null}

      <div className={css.actions}>
        <button className={css.cancelButton} type="button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className={css.submitButton}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
