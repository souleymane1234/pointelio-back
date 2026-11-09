import { foldSearchText, textIncludesQuery } from "./text-search.util";

describe("textIncludesQuery", () => {
  it("keeps only items whose fields contain the query, accents ignored", () => {
    const items = [
      { name: "Café crème", category: "Boissons" },
      { name: "Thé glacé", category: "Boissons" },
      { name: "Crêpe sucrée", category: "Desserts" },
    ];

    const matched = items.filter((item) =>
      textIncludesQuery("creme", item.name, item.category),
    );

    expect(matched.map((item) => item.name)).toEqual(["Café crème"]);
  });

  it("folds accents and case", () => {
    expect(foldSearchText("ÉLÉPHANT")).toBe(foldSearchText("elephant"));
  });
});
