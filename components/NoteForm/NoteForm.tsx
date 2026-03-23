"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { createNote } from "@/lib/api";
import { notesKeys } from "@/lib/queryKeys";
import { NOTE_TAGS, type NewNoteData, type NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().trim().required("Title is required."),
  content: Yup.string().trim(),
  tag: Yup.mixed<NoteTag>()
    .oneOf([...NOTE_TAGS])
    .required("Tag is required."),
});

const initialValues: NewNoteData = {
  title: "",
  content: "",
  tag: "Todo",
};

export function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();
  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      onCancel();
    },
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, actions) => {
        try {
          await createNoteMutation.mutateAsync({
            title: values.title.trim(),
            content: values.content.trim(),
            tag: values.tag,
          });
          actions.resetForm();
        } catch {
          actions.setStatus("Failed to create note.");
        }
      }}
    >
      {({ isSubmitting, status }) => (
        <Form className={css.form}>
          <label className={css.formGroup} htmlFor="title">
            Title
            <Field className={css.input} id="title" name="title" type="text" />
            <ErrorMessage className={css.error} component="p" name="title" />
          </label>

          <label className={css.formGroup} htmlFor="content">
            Content
            <Field
              as="textarea"
              className={css.textarea}
              id="content"
              name="content"
              rows={5}
            />
            <ErrorMessage className={css.error} component="p" name="content" />
          </label>

          <label className={css.formGroup} htmlFor="tag">
            Tag
            <Field as="select" className={css.select} id="tag" name="tag">
              {NOTE_TAGS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Field>
            <ErrorMessage className={css.error} component="p" name="tag" />
          </label>

          {status ? <p className={css.error}>{status}</p> : null}

          <div className={css.actions}>
            <button
              className={css.cancelButton}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={css.submitButton}
              type="submit"
              disabled={isSubmitting || createNoteMutation.isPending}
            >
              {isSubmitting || createNoteMutation.isPending
                ? "Saving..."
                : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
