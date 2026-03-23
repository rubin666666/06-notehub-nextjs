import axios from "axios";
import type { FetchNotesResponse } from "@/types/api";
import type { NewNoteData, Note } from "@/types/note";

function getNoteHubApi() {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (!token) {
    throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is not set.");
  }

  return axios.create({
    baseURL: "https://notehub-public.goit.study/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
};

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = "",
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response = await getNoteHubApi().get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await getNoteHubApi().get<Note>(`/notes/${id}`);
  return response.data;
}

export async function createNote(payload: NewNoteData): Promise<Note> {
  const response = await getNoteHubApi().post<Note>("/notes", payload);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await getNoteHubApi().delete<Note>(`/notes/${id}`);
  return response.data;
}
