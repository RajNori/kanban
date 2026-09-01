"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ComponentProps } from "react";
import type { Card } from "@/lib/types";

type CardFaceProps = ComponentProps<"button"> & {
  card: Card;
  overlay?: boolean;
  testId?: string;
};

export function CardFace({
  card,
  overlay = false,
  testId,
  className = "",
  ...rest
}: CardFaceProps) {
  return (
    <button
      type="button"
      data-testid={testId}
      className={`w-full rounded-xl border border-black/[0.04] bg-white p-4 text-left shadow-[0_8px_24px_rgba(3,33,71,0.06)] ring-1 ring-black/[0.03] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(3,33,71,0.1)] ${
        overlay ? "rotate-1 shadow-[0_16px_40px_rgba(3,33,71,0.16)]" : ""
      } ${className}`}
      {...rest}
    >
      <span className="mb-2 block h-0.5 w-8 rounded-full bg-accent" />
      <span className="block font-medium text-navy">{card.title}</span>
      <span className="mt-1 block text-sm leading-relaxed text-muted line-clamp-2">
        {card.details}
      </span>
    </button>
  );
}

type CardItemProps = {
  card: Card;
  onOpen: (cardId: string) => void;
};

export function CardItem({ card, onOpen }: CardItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  return (
    <CardFace
      card={card}
      testId={`card-${card.id}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : 1,
      }}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(card.id)}
    />
  );
}
