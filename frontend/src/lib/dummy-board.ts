import type { Board } from "./types";

export const dummyBoard: Board = {
  title: "Website Launch",
  columns: [
    {
      id: "col-backlog",
      title: "Backlog",
      cards: [
        {
          id: "card-brand",
          title: "Design brand system",
          details:
            "Define type, color, and spacing so marketing and product share one look.",
        },
        {
          id: "card-copy",
          title: "Draft homepage copy",
          details: "Write the hero, product story, and call to action.",
        },
        {
          id: "card-analytics",
          title: "Choose analytics",
          details: "Pick a lightweight tool for launch-week traffic.",
        },
      ],
    },
    {
      id: "col-ready",
      title: "Ready",
      cards: [
        {
          id: "card-nav",
          title: "Build navigation",
          details: "Primary links, mobile menu, and footer sitemap.",
        },
      ],
    },
    {
      id: "col-progress",
      title: "In Progress",
      cards: [
        {
          id: "card-hero",
          title: "Hero layout",
          details: "Full-bleed visual with headline, supporting line, and CTA.",
        },
        {
          id: "card-cms",
          title: "Connect CMS",
          details: "Wire the landing page to the content model.",
        },
      ],
    },
    {
      id: "col-review",
      title: "Review",
      cards: [],
    },
    {
      id: "col-done",
      title: "Done",
      cards: [
        {
          id: "card-domain",
          title: "Register domain",
          details: "Domain purchased and DNS pointed at hosting.",
        },
      ],
    },
  ],
};
