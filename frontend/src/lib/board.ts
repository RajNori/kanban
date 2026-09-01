import type { Board, Card, Column, Columns } from "./types";

export function findColumn(
  board: Board,
  columnId: string,
): Column | undefined {
  for (const column of board.columns) {
    if (column.id === columnId) {
      return column;
    }
  }
  return undefined;
}

export function findCardLocation(
  board: Board,
  cardId: string,
): { column: Column; card: Card; index: number } | undefined {
  for (const column of board.columns) {
    const index = column.cards.findIndex((card) => card.id === cardId);
    if (index === -1) {
      continue;
    }
    const card = column.cards[index];
    if (card) {
      return { column, card, index };
    }
  }
  return undefined;
}

function mapColumns(
  columns: Columns,
  updater: (column: Column) => Column,
): Columns {
  return [
    updater(columns[0]),
    updater(columns[1]),
    updater(columns[2]),
    updater(columns[3]),
    updater(columns[4]),
  ];
}

export function renameColumn(
  board: Board,
  columnId: string,
  title: string,
): Board {
  return {
    ...board,
    columns: mapColumns(board.columns, (column) =>
      column.id === columnId ? { ...column, title } : column,
    ),
  };
}

export function addCard(board: Board, columnId: string, card: Card): Board {
  return {
    ...board,
    columns: mapColumns(board.columns, (column) =>
      column.id === columnId
        ? { ...column, cards: [...column.cards, card] }
        : column,
    ),
  };
}

export function updateCard(
  board: Board,
  cardId: string,
  fields: { title: string; details: string },
): Board {
  return {
    ...board,
    columns: mapColumns(board.columns, (column) => ({
      ...column,
      cards: column.cards.map((card) =>
        card.id === cardId ? { ...card, ...fields } : card,
      ),
    })),
  };
}

export function deleteCard(board: Board, cardId: string): Board {
  return {
    ...board,
    columns: mapColumns(board.columns, (column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    })),
  };
}

export function moveCard(
  board: Board,
  cardId: string,
  targetColumnId: string,
  targetIndex: number,
): Board {
  const location = findCardLocation(board, cardId);
  if (!location) {
    return board;
  }

  const target = findColumn(board, targetColumnId);
  if (!target) {
    return board;
  }

  const withoutCard = mapColumns(board.columns, (column) => ({
    ...column,
    cards: column.cards.filter((card) => card.id !== cardId),
  }));

  const destination = findColumn(
    { ...board, columns: withoutCard },
    targetColumnId,
  );
  if (!destination) {
    return board;
  }

  const index = Math.max(0, Math.min(targetIndex, destination.cards.length));
  const nextCards = [...destination.cards];
  nextCards.splice(index, 0, location.card);

  return {
    ...board,
    columns: mapColumns(withoutCard, (column) =>
      column.id === targetColumnId ? { ...column, cards: nextCards } : column,
    ),
  };
}
