import { expect, test, type Locator, type Page } from "@playwright/test";

async function dragCardToColumn(
  page: Page,
  card: Locator,
  columnDrop: Locator,
) {
  const cardBox = await card.boundingBox();
  const columnBox = await columnDrop.boundingBox();
  if (!cardBox || !columnBox) {
    throw new Error("Could not measure drag targets");
  }

  await page.mouse.move(
    cardBox.x + cardBox.width / 2,
    cardBox.y + cardBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    columnBox.x + columnBox.width / 2,
    columnBox.y + 40,
    { steps: 20 },
  );
  await page.mouse.up();
}

test.describe("Kanban board", () => {
  test("shows dummy data in five columns", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Website Launch" })).toBeVisible();
    await expect(page.getByTestId("column-col-backlog")).toBeVisible();
    await expect(page.getByTestId("column-col-ready")).toBeVisible();
    await expect(page.getByTestId("column-col-progress")).toBeVisible();
    await expect(page.getByTestId("column-col-review")).toBeVisible();
    await expect(page.getByTestId("column-col-done")).toBeVisible();
    await expect(page.getByText("Design brand system")).toBeVisible();
    await expect(page.getByTestId("column-col-review")).toContainText("0 cards");
  });

  test("renames a column", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("column-title-col-backlog").click();
    const input = page.getByTestId("column-title-input-col-backlog");
    await input.fill("Ideas");
    await input.press("Enter");
    await expect(page.getByTestId("column-title-col-backlog")).toHaveText("Ideas");
  });

  test("adds a card", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("add-card-col-review").click();
    await page.getByTestId("card-title-input").fill("QA pass");
    await page.getByTestId("card-details-input").fill("Check the launch checklist.");
    await page.getByTestId("save-card").click();
    await expect(page.getByTestId("column-col-review")).toContainText("QA pass");
    await expect(page.getByTestId("column-col-review")).toContainText("1 card");
  });

  test("edits card details", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("card-card-brand").click();
    await page.getByTestId("card-title-input").fill("Brand kit");
    await page.getByTestId("card-details-input").fill("Shared colors and type.");
    await page.getByTestId("save-card").click();
    await expect(page.getByTestId("card-card-brand")).toContainText("Brand kit");
    await expect(page.getByTestId("card-card-brand")).toContainText(
      "Shared colors and type.",
    );
  });

  test("deletes a card", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("card-card-domain").click();
    await page.getByTestId("delete-card").click();
    await expect(page.getByTestId("card-card-domain")).toHaveCount(0);
    await expect(page.getByTestId("column-col-done")).toContainText("0 cards");
  });

  test("drags a card to another column", async ({ page }) => {
    await page.goto("/");
    const card = page.getByTestId("card-card-nav");
    const review = page.getByTestId("column-drop-col-review");
    await dragCardToColumn(page, card, review);
    await expect(page.getByTestId("column-col-review")).toContainText(
      "Build navigation",
    );
    await expect(page.getByTestId("column-col-ready")).not.toContainText(
      "Build navigation",
    );
  });
});
