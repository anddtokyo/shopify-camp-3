import shopify from "./shopify.js";
import { getShopFromSession } from "./shop.js";

const METAFIELDS_NAMESPACE = "jp_plus_camp3_exercise6";
const METAFIELDS_MULTIPASS_SECRET_KEY = "multipass_secret";

/**
 * storeShopMultipassSecret
 * @param {import('@shopify/shopify-api').Session} session
 * @param {string} secret
 * @return {Promise<string|null>}
 */
export async function updateShopMultipassSecret(session, secret) {
  const shop = await getShopFromSession(session);
  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: {
      query: `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        createdAt
        updatedAt
      }
      userErrors {
        field
        message
        code
      }
    }
  }
  `,
      variables: {
        metafields: [
          {
            key: METAFIELDS_MULTIPASS_SECRET_KEY,
            namespace: METAFIELDS_NAMESPACE,
            ownerId: shop.id,
            type: "single_line_text_field",
            value: secret,
          },
        ],
      },
    },
  });

  return response?.body?.data?.metafieldsSet?.metafields?.[0]?.value ?? null;
}

/**
 *
 * @param {import('@shopify/shopify-api').Session} session
 * @return {Promise<string|null>}
 */
export async function getShopMultipassSecret(session) {
  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: {
      query: `query {
  shop {
    name
    metafield (namespace: "${METAFIELDS_NAMESPACE}", key: "${METAFIELDS_MULTIPASS_SECRET_KEY}") {
      value
    }
  }
}
`,
    },
  });

  return response?.body?.data?.shop?.metafield?.value ?? null;
}
