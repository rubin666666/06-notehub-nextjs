"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { notesKeys } from "@/lib/queryKeys";
import css from "./page.module.css";

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

export function NoteDetailsClient() {
  const params = useParams<{ id: string }>();
  const noteId = params.id;

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: notesKeys.detail(noteId),
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formatDate(note.createdAt)}</p>
      </div>
    </div>
  );
}
