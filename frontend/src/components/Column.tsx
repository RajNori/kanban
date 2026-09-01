"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useState } from "react";
import type { Column as ColumnType } from "@/lib/types";
import { CardItem } from "./CardItem";

type ColumnProps = {
  column: ColumnType;
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string) => void;
  onOpenCard: (cardId: string) => void;
};

export function Column({
  column,
  onRename,
  onAddCard,
  onOpenCard,
}: ColumnProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(column.title);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function commitRename() {
    const next = draft.trim();
    onRename(column.id, next.length > 0 ? next : column.title);
    setEditing(false);
    if (next.length === 0) {
      setDraft(column.title);
    }
  }

  return (
    <section
      data-testid={`column-${column.id}`}
      className={`flex min-h-[28rem] w-[19.5rem] shrink-0 flex-col rounded-2xl border border-black/[0.04] bg-white/80 p-3 shadow-[0_10px_40px_rgba(3,33,71,0.06)] backdrop-blur ${
        isOver ? "ring-2 ring-primary/40" : ""
      }`}
    >
      <header className="mb-3 flex items-start justify-between gap-2 px-1 pt-1">
        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              data-testid={`column-title-input-${column.id}`}
              className="w-full rounded-md border border-primary/30 bg-white px-2 py-1 text-sm font-semibold text-navy outline-none ring-2 ring-primary/20"
              value={draft}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              onBlur={commitRename}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commitRename();
                }
                if (event.key === "Escape") {
                  setDraft(column.title);
                  setEditing(false);
                }
              }}
            />
          ) : (
            <button
              type="button"
              data-testid={`column-title-${column.id}`}
              className="truncate text-left text-sm font-semibold tracking-wide text-navy"
              onClick={() => {
                setDraft(column.title);
                setEditing(true);
              }}
            >
              {column.title}
            </button>
          )}
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {column.cards.length} {column.cards.length === 1 ? "card" : "cards"}
          </p>
        </div>
      </header>

      <div
        ref={setNodeRef}
        data-testid={`column-drop-${column.id}`}
        className="flex flex-1 flex-col gap-3 rounded-xl bg-[#f7fafc] p-2"
      >
        <SortableContext
          items={column.cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <CardItem key={card.id} card={card} onOpen={onOpenCard} />
          ))}
        </SortableContext>
      </div>

      <button
        type="button"
        data-testid={`add-card-${column.id}`}
        className="mt-3 rounded-xl bg-action px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#5e2d75]"
        onClick={() => onAddCard(column.id)}
      >
        Add card
      </button>
    </section>
  );
}
