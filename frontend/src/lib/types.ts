export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export type Columns = [Column, Column, Column, Column, Column];

export type Board = {
  title: string;
  columns: Columns;
};
