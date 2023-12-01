import * as crypto from "crypto";
import { faker } from "@faker-js/faker";

/**
 * handleMultipassSignIn
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export async function handleMultipassSignIn(req, res) {
  const email = decodeURIComponent(
    req.query.email || faker.internet.exampleEmail().toLowerCase()
  );
  const shop = decodeURIComponent(req.query.shop || process.env.SHOP);

  const signInToken = await generateMultipassToken(
    { email, created_at: new Date().toISOString() },
    process.env.SHOPIFY_MULTIPASS_SECRET
  );

  return res.redirect(`https://${shop}/account/login/multipass/${signInToken}`);
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
