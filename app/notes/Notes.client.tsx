"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/Modal/Modal";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import { NoteList } from "@/components/NoteList/NoteList";
import { Pagination } from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";
import { notesKeys } from "@/lib/queryKeys";
import css from "./page.module.css";

type NotesClientProps = {
  initialPage: number;
  initialSearch: string;
};

export function NotesClient({ initialPage, initialSearch }: NotesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(initialSearch);

  const page = Number(searchParams.get("page")) || initialPage;
  const search = searchParams.get("search") ?? initialSearch;

  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      const nextQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (nextQuery === currentQuery) {
        return;
      }

      startTransition(() => {
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
      });
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, router, searchParams, searchValue]);

  const { data, isLoading, error } = useQuery({
    queryKey: notesKeys.list(page, search),
    queryFn: () => fetchNotes({ page, search }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));

    const nextQuery = params.toString();

    startTransition(() => {
      router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname);
    });
  };

  if (isLoading || isPending) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={searchValue} onChange={setSearchValue} />
        <button
          className={css.button}
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note
        </button>
      </div>

      <NoteList notes={data?.notes ?? []} />

      <Pagination
        pageCount={data?.totalPages ?? 0}
        currentPage={page}
        onPageChange={handlePageChange}
      />

      {isModalOpen ? (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      ) : null}
    </main>
  );
}
