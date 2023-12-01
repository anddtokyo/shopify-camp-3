import * as crypto from "crypto";
import { readFileSync } from "fs";
import { join } from "path";
import shopify from "./shopify.js";
import { getShopMultipassSecret } from "./metafield.js";

/**
 * handleMultipassSignIn
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export async function handleMultipassSignIn(req, res) {
  const shop = decodeURIComponent(req?.query?.shop ?? "");
  const email = decodeURIComponent(req?.query?.email ?? "");

  if (!shop) {
    return res.status(403).send("OK");
  }

  if (email) {
    const session = await shopify.config.sessionStorage.loadSession(
      shopify.api.session.getOfflineId(shop)
    );

    if (!session) {
      return res.status(403).send("OK");
    }

    const secret = await getShopMultipassSecret(session);

    const signInToken = await generateMultipassToken(
      { email, created_at: new Date().toISOString() },
      secret
    );

    return res.redirect(
      `https://${shop}/account/login/multipass/${signInToken}`
    );
  }

  return res
    .status(200)
    .send(
      readFileSync(join(process.cwd(), "views/multipass.html"))
        .toString("utf-8")
        .replace("{{url}}", `${process.env.HOST}/api/sign-in/multipass`)
        .replace("{{shop}}", `${shop}`)
    );
}

/**
 * generateMultipassToken
 * @param {{email: string; created_at: string}} customer
 * @param {string} secret
 * @returns {Promise<string>}
 */
async function generateMultipassToken(customer, secret) {
  const BLOCK_SIZE = 16;
  const hash = crypto.createHash("sha256").update(secret).digest();
  const encryptionKey = hash.slice(0, BLOCK_SIZE);
  const signingKey = hash.slice(BLOCK_SIZE, 32);
  const iv = crypto.randomBytes(BLOCK_SIZE);
  const cipher = crypto.createCipheriv("aes-128-cbc", encryptionKey, iv);
  const encrypted = Buffer.concat([
    iv,
    cipher.update(JSON.stringify(customer), "utf8"),
    cipher.final(),
  ]);
  const signed = crypto
    .createHmac("SHA256", signingKey)
    .update(encrypted)
    .digest();

  const token = Buffer.concat([encrypted, signed]).toString("base64");

  return token.replace(/\+/g, "-").replace(/\//g, "_");
}
