import { getShopFulfillmentServiceId } from "./metafield.js";
import shopify from "./shopify.js";
import { nodesFromEdges } from "@shopify/admin-graphql-api-utilities";

/**
 * inventoryAdjustQuantitiesController
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise<void>}
 */
export async function inventoryAdjustQuantitiesController(req, res) {
  /** @type {import('@shopify/shopify-api').Session} */
  const session = res.locals.shopify.session;
  const fulfillmentServiceId = await getShopFulfillmentServiceId(session);
  const quantities = parseInt(req.body.quantities, 10) || 10;

  if (!fulfillmentServiceId) {
    throw new Error("NO FULFILLMENT SERVICE");
  }

  const { inventoryLevels, locationId } = await getInventoryLevels(
    session,
    fulfillmentServiceId
  );

  for (const inventoryLevel of inventoryLevels) {
    await inventoryAdjustQuantities(
      session,
      quantities,
      inventoryLevel.item.id,
      locationId
    );
  }

  res.json({});
}

/**
 * getInventoryLevels
 * @param {import('@shopify/shopify-api').Session} session
 * @param {string} fulfillmentServiceId
 * @return {Promise<{inventoryLevels: any[]; locationId: string | null}>}
 */
async function getInventoryLevels(session, fulfillmentServiceId) {
  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: {
      query: `{
  fulfillmentService(id: "${fulfillmentServiceId}") {
    id
    serviceName
    location {
      id
      inventoryLevels(first: 10) {
        edges {
          node {
            id
            item {
              id
              variant {
                id
                title
                product {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  }
}`,
    },
  });

  const inventoryLevels = nodesFromEdges(
    response?.body?.data?.fulfillmentService?.location?.inventoryLevels
      ?.edges ?? []
  );

  const locationId =
    response?.body?.data?.fulfillmentService?.location?.id ?? null;

  return { inventoryLevels, locationId };
}

/**
 * inventoryAdjustQuantities
 * @param {import('@shopify/shopify-api').Session} session
 * @param {number} quantity
 * @param {string} inventoryItemId
 * @param {string} locationId
 * @param {string|null} ledgerDocumentUri
 * @return {Promise<void>}
 */
async function inventoryAdjustQuantities(
  session,
  quantity,
  inventoryItemId,
  locationId,
  ledgerDocumentUri = null
) {
  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: {
      query: `mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
  inventoryAdjustQuantities(input: $input) {
    inventoryAdjustmentGroup {
      id
    }
    userErrors {
      field
      message
    }
  }
}
`,
      variables: {
        input: {
          changes: [
            {
              delta: quantity,
              inventoryItemId,
              locationId,
              ledgerDocumentUri,
            },
          ],
          name: `available`,
          reason: `received`,
        },
      },
    },
  });

  console.log(JSON.stringify(response, undefined, 2));
}
