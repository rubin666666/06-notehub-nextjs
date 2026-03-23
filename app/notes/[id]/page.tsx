import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { getQueryClient } from "@/lib/getQueryClient";
import { notesKeys } from "@/lib/queryKeys";
import { NoteDetailsClient } from "./NoteDetails.client";

export const dynamic = "force-dynamic";

type NoteDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: notesKeys.detail(id),
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
