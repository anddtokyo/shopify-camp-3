// @ts-check
import "dotenv/config";
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";
import { handleMultipassSignIn } from "./shopify.multipass.js";
import {
  getShopMultipassSecret,
  updateShopMultipassSecret,
} from "./metafield.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.get("/api/sign-in/multipass", handleMultipassSignIn);

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.get("/api/multipass/secret", async (req, res) => {
  const session = res.locals.shopify.session;

  res.json({
    signInUrl: `${process.env.HOST}/api/sign-in/multipass?shop=${session.shop}`,
    secret: await getShopMultipassSecret(res.locals.shopify.session),
  });
});

app.post("/api/multipass/secret", async (req, res) => {
  const secret = req?.body?.secret;

  if (!secret) {
    return res.status(400).json({ error: "Secret can not be blank" });
  }

  const session = res.locals.shopify.session;

  res.json({
    signInUrl: `${process.env.HOST}/api/sign-in/multipass?shop=${session.shop}`,
    secret: await updateShopMultipassSecret(session, secret),
  });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
