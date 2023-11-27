import { register } from "@shopify/web-pixels-extension";

register(async ({ analytics, browser, settings }) => {
  // Subscribe to events
  analytics.subscribe("page_viewed", (event) => {
    console.log({ event });
  });
});
