"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useRef, useState } from "react";
import {
  addCard,
  deleteCard,
  findCardLocation,
  findColumn,
  moveCard,
  renameColumn,
  updateCard,
} from "@/lib/board";
import { dummyBoard } from "@/lib/dummy-board";
import type { Card } from "@/lib/types";
import { CardDialog } from "./CardDialog";
import { CardFace } from "./CardItem";
import { Column } from "./Column";

type DialogState =
  | { mode: "closed" }
  | { mode: "add"; columnId: string }
  | { mode: "edit"; cardId: string };

export function Board() {
  const [board, setBoard] = useState(dummyBoard);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const didDrag = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const editingCard =
    dialog.mode === "edit" ? findCardLocation(board, dialog.cardId)?.card : undefined;

  function handleDragStart(event: DragStartEvent) {
    didDrag.current = true;
    const location = findCardLocation(board, String(event.active.id));
    setActiveCard(location?.card ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    setBoard((current) => {
      const from = findCardLocation(current, activeId);
      if (!from) {
        return current;
      }

      const overColumn = findColumn(current, overId);
      const overCard = findCardLocation(current, overId);
      const targetColumnId = overColumn?.id ?? overCard?.column.id;
      if (!targetColumnId) {
        return current;
      }

      let targetIndex: number;
      if (overColumn) {
        targetIndex = overColumn.cards.length;
      } else if (overCard) {
        targetIndex = overCard.index;
      } else {
        return current;
      }

      if (from.column.id === targetColumnId && from.index === targetIndex) {
        return current;
      }

      return moveCard(current, activeId, targetColumnId, targetIndex);
    });
  }

  function openCard(cardId: string) {
    if (didDrag.current) {
      return;
    }
    setDialog({ mode: "edit", cardId });
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-black/[0.04] bg-white/90 px-8 py-6 backdrop-blur">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
          Project board
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-navy">
          {board.title}
        </h1>
        <div className="mt-3 h-1 w-16 rounded-full bg-accent" />
        <p className="mt-3 max-w-xl text-sm text-muted">
          Five columns. Rename them, add cards, and drag work across the board.
        </p>
      </header>

      <div className="flex-1 overflow-x-auto px-8 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            setActiveCard(null);
            didDrag.current = false;
          }}
        >
          <div className="flex min-w-max items-start gap-4">
            {board.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                onRename={(columnId, title) =>
                  setBoard((current) => renameColumn(current, columnId, title))
                }
                onAddCard={(columnId) => setDialog({ mode: "add", columnId })}
                onOpenCard={openCard}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCard ? <CardFace card={activeCard} overlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <CardDialog
        key={
          dialog.mode === "add"
            ? `add-${dialog.columnId}`
            : dialog.mode === "edit"
              ? `edit-${dialog.cardId}`
              : "closed"
        }
        open={dialog.mode !== "closed"}
        heading={dialog.mode === "add" ? "New card" : "Card"}
        title={editingCard?.title ?? ""}
        details={editingCard?.details ?? ""}
        onClose={() => setDialog({ mode: "closed" })}
        onSave={(fields) => {
          if (dialog.mode === "add") {
            const card: Card = {
              id: crypto.randomUUID(),
              title: fields.title,
              details: fields.details,
            };
            setBoard((current) => addCard(current, dialog.columnId, card));
          } else if (dialog.mode === "edit") {
            setBoard((current) => updateCard(current, dialog.cardId, fields));
          }
          setDialog({ mode: "closed" });
        }}
        onDelete={
          dialog.mode === "edit"
            ? () => {
                setBoard((current) => deleteCard(current, dialog.cardId));
                setDialog({ mode: "closed" });
              }
            : undefined
        }
      />
    </div>
  );
}
