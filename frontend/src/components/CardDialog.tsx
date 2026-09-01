"use client";

import { useState } from "react";

type CardDialogProps = {
  open: boolean;
  heading: string;
  title: string;
  details: string;
  onClose: () => void;
  onSave: (fields: { title: string; details: string }) => void;
  onDelete?: () => void;
};

export function CardDialog({
  open,
  heading,
  title,
  details,
  onClose,
  onSave,
  onDelete,
}: CardDialogProps) {
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDetails, setDraftDetails] = useState(details);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4"
      data-testid="card-dialog-backdrop"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-dialog-title"
        data-testid="card-dialog"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(3,33,71,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 h-0.5 w-12 rounded-full bg-accent" />
        <h2
          id="card-dialog-title"
          className="text-xl font-semibold text-navy"
        >
          {heading}
        </h2>
        <p className="mt-1 text-sm text-muted">Title and details only.</p>

        <form
          className="mt-5 flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            const nextTitle = draftTitle.trim();
            if (nextTitle.length === 0) {
              return;
            }
            onSave({ title: nextTitle, details: draftDetails.trim() });
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Title
            </span>
            <input
              data-testid="card-title-input"
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-navy outline-none ring-primary/20 focus:ring-2"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              autoFocus
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted">
              Details
            </span>
            <textarea
              data-testid="card-details-input"
              className="h-32 w-full resize-none rounded-lg border border-black/10 px-3 py-2 text-navy outline-none ring-primary/20 focus:ring-2"
              value={draftDetails}
              onChange={(event) => setDraftDetails(event.target.value)}
            />
          </label>
          <div className="mt-2 flex items-center justify-between gap-3">
            {onDelete ? (
              <button
                type="button"
                data-testid="delete-card"
                className="text-sm font-medium text-muted hover:text-navy"
                onClick={onDelete}
              >
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                data-testid="cancel-card"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:text-navy"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="save-card"
                className="rounded-lg bg-action px-4 py-2 text-sm font-medium text-white hover:bg-[#5e2d75]"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
