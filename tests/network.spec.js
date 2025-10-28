import { test, expect } from "@playwright/test";

test("This is to cjeck network interception", async ({ page }) => {
  // page.route("https://fakestoreapi.com/products/1", async (route, request) => {
  //   console.log(request.url());
  //   console.log(request.headers());
  //   await route.continue();
  // });
  // const page = await context.newPage();

  page.route("https://fakestoreapi.com/products/1", async (route) => {
    // console.log(route.request().headers());
    // await route.continue();
    const bdy = {
      id: 1,
      title: "LPS",
      rating: { rate: 3.9, count: 120 },
    };
    const response = await page.request.fetch(route.request());
    const headers = { ...response.headers() };
    delete headers["content-length"];
    delete headers["content-encoding"];
    const body = JSON.stringify(bdy);
    await route.fulfill({
      status: response.status(),
      headers,
      body,
    });
  });

  const response = await page.goto("https://fakestoreapi.com/products/1");

  console.log(response.headers());

  // console.log(response);
});
