import { test, expect } from "@playwright/test";

test("This is to get all the products", async ({ page }) => {
  await page.route("https://fakestoreapi.com/products", async (route) => {
    const response = await page.request.fetch(route.request());
    const dt = await response.json();

    const resp = { ...response.headers() };
    resp["content-type"] = "text/plain";
    for (let { title } of dt) {
      if ((title = "DANVOUY Womens T Shirt Casual Cotton Short")) {
        const bd = JSON.stringify(title);
        await route.fulfill({
          response: resp,
          body: bd,
        });
        break;
      } else {
        await route.continue();
      }
    }
  });

  await page.goto("https://fakestoreapi.com/products");

  await page.pause();
});

test("This is to post data to api/database", async ({ page, request }) => {
  const payload = {
    id: 17,
    title: "ABD",
    price: 100,
    description: "Alien",
    category: "Not Human",
    image: "http://example.com",
  };

  await page.goto("https://fakestoreapi.com");

  await page.route("https://fakestoreapi.com/products", async (route) => {
    const resp = await page.request.fetch(route.request());
    console.log(resp.status());
    await route.continue();
  });

  await page.evaluate((payload) => {
    fetch(
      "https://fakestoreapi.com/products",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      payload
    );
  });

  await page.waitForTimeout(5000);
});

test.only("This is to used for get based on id", async ({ page }) => {
  await page.route(/.*\/products\/(?:[1-9]|1[0-9]|2[0-9])$/, async (route) => {
    const url = route.request().url();

    const response = await page.request.fetch(route.request());

    const id = url.split("/").pop();

    const payload = {
      title: "ABD",
      price: 100,
      description: "Alien",
      category: "Not Human",
      image: "http://example.com",
    };
    const resp = await page.request.fetch("https://fakestoreapi.com/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    await route.fulfill({
      headers: {
        ...response.headers,
        "content-type": "text/plain",
      },
      body: "This is the response",
    });
  });

  const response = await page.goto("https://fakestoreapi.com/products/19");
  console.log(response.headers());

  await page.waitForTimeout(5000);
});
