import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { getQueryClient } from "@/lib/getQueryClient";
import { notesKeys } from "@/lib/queryKeys";
import { NotesClient } from "./Notes.client";

export const dynamic = "force-dynamic";

type NotesPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const search = params.search?.trim() ?? "";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: notesKeys.list(page, search),
    queryFn: () => fetchNotes({ page, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialSearch={search} />
    </HydrationBoundary>
  );
}
