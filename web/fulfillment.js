import {
  getShopFulfillmentServiceId,
  updateFulfillmentServiceId,
} from "./metafield.js";
import shopify from "./shopify.js";

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise<void>}
 */
export async function fulfillmentServiceRegisterController(req, res) {
  /** @type {import('@shopify/shopify-api').Session} session */
  const session = res.locals.shopify.session;
  let fulfillmentServiceId;

  fulfillmentServiceId = await getShopFulfillmentServiceId(session);

  if (fulfillmentServiceId) {
    await deleteFulfillmentService(session, fulfillmentServiceId);
  }

  fulfillmentServiceId = await createFulfillmentService(session);
  await updateFulfillmentServiceId(session, fulfillmentServiceId);

  res.json({});
}

/**
 * createFulfillmentService
 * @param {import('@shopify/shopify-api').Session} session
 * @return {Promise<string>}
 */
async function createFulfillmentService(session) {
  const client = new shopify.api.clients.Graphql({ session });

  /** @type {import('@shopify/shopify-api').RequestReturn<{data:{fulfillmentServiceCreate:{fulfillmentService:{id: string},userErrors:any[]}}}>} */
  const response = await client.query({
    data: {
      query: `mutation fulfillmentServiceCreate(
  $callbackUrl: URL!
  $fulfillmentOrdersOptIn: Boolean!
  $inventoryManagement: Boolean!
  $permitsSkuSharing: Boolean!
  $trackingSupport: Boolean!
  $name: String!
) {
  fulfillmentServiceCreate(
    callbackUrl: $callbackUrl
    fulfillmentOrdersOptIn: $fulfillmentOrdersOptIn
    inventoryManagement: $inventoryManagement
    permitsSkuSharing: $permitsSkuSharing
    trackingSupport: $trackingSupport
    name: $name
  ) {
    fulfillmentService {
      id
      serviceName
      callbackUrl
      fulfillmentOrdersOptIn
      inventoryManagement
      permitsSkuSharing
      location {
        id
      }
      type
    }
    userErrors {
      field
      message
    }
  }
}`,
      variables: {
        callbackUrl: `${process.env.HOST}/api/fulfillment/callback`,
        fulfillmentOrdersOptIn: true,
        inventoryManagement: true,
        permitsSkuSharing: true,
        trackingSupport: true,
        name: "JP-PLUS-CAMP-3 APP FULFILLMENT SERVICE",
      },
    },
  });

  if (response?.body?.data?.fulfillmentServiceCreate?.userErrors?.length > 0) {
    throw new Error(
      `${response?.body?.data?.fulfillmentServiceCreate?.userErrors
        ?.map((e) => e.message)
        ?.toString()}`
    );
  }

  return (
    response?.body?.data?.fulfillmentServiceCreate?.fulfillmentService?.id ??
    null
  );
}

/**
 * deleteFulfillmentService
 * @param {import('@shopify/shopify-api').Session} session
 * @param {string} id
 * @return {Promise<void>}
 */
async function deleteFulfillmentService(session, id) {
  const client = new shopify.api.clients.Graphql({ session });

  /** @type {import('@shopify/shopify-api').RequestReturn<{data:{fulfillmentServiceDelete:{userErrors:any[]}}}>} */
  const response = await client.query({
    data: {
      query: `mutation fulfillmentServiceDelete($id: ID!) {
          fulfillmentServiceDelete(id: $id) {
            deletedId
            userErrors {
              field
              message
            }
          }
        }`,
      variables: {
        id,
      },
    },
  });

  if (response?.body?.data?.fulfillmentServiceDelete?.userErrors?.length > 0) {
    throw new Error(
      response?.body?.data?.fulfillmentServiceDelete?.userErrors
        ?.map((e) => e.message)
        ?.toString()
    );
  }
}
