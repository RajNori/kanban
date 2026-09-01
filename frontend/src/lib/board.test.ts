import { describe, expect, it } from "vitest";
import {
  addCard,
  deleteCard,
  findCardLocation,
  findColumn,
  moveCard,
  renameColumn,
  updateCard,
} from "./board";
import { dummyBoard } from "./dummy-board";
import type { Board, Card } from "./types";

const sampleCard: Card = {
  id: "card-new",
  title: "New card",
  details: "Details for the new card",
};

describe("dummy board", () => {
  it("has five columns and cards with title and details", () => {
    expect(dummyBoard.columns).toHaveLength(5);
    const cards = dummyBoard.columns.flatMap((column) => column.cards);
    expect(cards.length).toBeGreaterThan(0);
    for (const card of cards) {
      expect(card.title.length).toBeGreaterThan(0);
      expect(card.details.length).toBeGreaterThan(0);
    }
  });
});

describe("renameColumn", () => {
  it("renames a column and keeps five columns", () => {
    const next = renameColumn(dummyBoard, "col-backlog", "Ideas");
    expect(next.columns).toHaveLength(5);
    expect(findColumn(next, "col-backlog")?.title).toBe("Ideas");
    expect(findColumn(dummyBoard, "col-backlog")?.title).toBe("Backlog");
  });
});

describe("addCard", () => {
  it("appends a card to the given column", () => {
    const next = addCard(dummyBoard, "col-review", sampleCard);
    const review = findColumn(next, "col-review");
    expect(review?.cards).toHaveLength(1);
    expect(review?.cards[0]).toEqual(sampleCard);
  });
});

describe("updateCard", () => {
  it("updates title and details", () => {
    const next = updateCard(dummyBoard, "card-brand", {
      title: "Brand kit",
      details: "Updated details",
    });
    expect(findCardLocation(next, "card-brand")?.card).toEqual({
      id: "card-brand",
      title: "Brand kit",
      details: "Updated details",
    });
  });
});

describe("deleteCard", () => {
  it("removes a card", () => {
    const next = deleteCard(dummyBoard, "card-hero");
    expect(findCardLocation(next, "card-hero")).toBeUndefined();
    expect(findColumn(next, "col-progress")?.cards).toHaveLength(1);
  });
});

describe("moveCard", () => {
  it("reorders within a column", () => {
    const next = moveCard(dummyBoard, "card-analytics", "col-backlog", 0);
    const backlog = findColumn(next, "col-backlog");
    expect(backlog?.cards.map((card) => card.id)).toEqual([
      "card-analytics",
      "card-brand",
      "card-copy",
    ]);
  });

  it("moves a card across columns", () => {
    const next = moveCard(dummyBoard, "card-nav", "col-progress", 0);
    expect(findColumn(next, "col-ready")?.cards).toHaveLength(0);
    expect(findColumn(next, "col-progress")?.cards.map((card) => card.id)).toEqual(
      ["card-nav", "card-hero", "card-cms"],
    );
  });

  it("drops onto an empty column", () => {
    const next = moveCard(dummyBoard, "card-domain", "col-review", 0);
    expect(findColumn(next, "col-done")?.cards).toHaveLength(0);
    expect(findColumn(next, "col-review")?.cards.map((card) => card.id)).toEqual([
      "card-domain",
    ]);
  });

  it("returns the same board when the card is missing", () => {
    const next = moveCard(dummyBoard, "missing", "col-review", 0);
    expect(next).toBe(dummyBoard);
  });
});

describe("board shape", () => {
  it("preserves the five-column tuple after mutations", () => {
    let board: Board = dummyBoard;
    board = renameColumn(board, "col-done", "Shipped");
    board = addCard(board, "col-ready", sampleCard);
    board = updateCard(board, "card-copy", {
      title: "Homepage copy",
      details: "Shorter hero",
    });
    board = deleteCard(board, "card-analytics");
    board = moveCard(board, "card-cms", "col-review", 0);
    expect(board.columns).toHaveLength(5);
  });
});
