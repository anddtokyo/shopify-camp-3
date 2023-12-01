import shopify from "./shopify.js";

/**
 * storeShopMultipassSecret
 * @param {import('@shopify/shopify-api').Session} session
 * @return {{id: string} | null}
 */
export async function getShopFromSession(session) {
  const client = new shopify.api.clients.Graphql({ session });

  const response = await client.query({
    data: {
      query: `query {
  shop {
    id
    name
    myshopifyDomain
  }
}
`,
    },
  });

  return response?.body?.data?.shop ?? null;
}
