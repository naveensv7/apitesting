import { test, expect } from "@playwright/test";

test("This is to get data by id i not provide the custom response", async ({
  page,
}) => {
  await page.route(/.*\/products\/(?:[1-9]|1[0-9]|2[0-9])$/, async (route) => {
    const response = await page.request.fetch(route.request());

    if ((await response.body()).toString("utf-8").length === 0) {
      const resp = await page.request.fetch(
        "https://fakestoreapi.com/products",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          data: JSON.stringify({
            title: "ABD",
            price: 100,
            description: "Alien",
            category: "Not Human",
            image: "http://example.com",
          }),
        }
      );

      const body = await resp.json();

      await route.fulfill({
        headers: {
          ...response.headers,
        },
        body: JSON.stringify(body),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto("https://fakestoreapi.com/products/26");

  await page.waitForTimeout(5000);
});
