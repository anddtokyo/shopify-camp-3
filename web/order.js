import shopify from "./shopify.js";
import { composeGid } from "@shopify/admin-graphql-api-utilities";

/**
 * getOrderController
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise<void>}
 */
export async function getOrderController(req, res) {
  /** @type {import('@shopify/shopify-api').Session} */
  const session = res.locals.shopify.session;
  const id = req.params.id;

  if (!id || typeof id !== "string") {
    throw new Error(`ORDER ID CAN NOT BE BLANK`);
  }

  const order = await getOrderById(session, composeGid("Order", id));

  res.json({ order });
}

/**
 * fulfillOrderController
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise<void>}
 */
export async function fulfillOrderController(req, res) {
  const session = res.locals.shopify.session;
  const ids = req.body.ids;

  if (!ids || typeof ids !== "string") {
    throw new Error(`ORDER ID CAN NOT BE BLANK`);
  }

  const fulfillments = [];

  for (const id of ids.split(",")) {
    const fulfillment = await createFulfillment(session, id);

    fulfillments.push(fulfillment);
  }

  res.json({ fulfillments });
}

/**
 * orderCaptureController
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @return {Promise<void>}
 */
export async function orderCaptureController(req, res) {
  const session = res.locals.shopify.session;
  const orderId = req.body.orderId;
  const transactions = req.body.transactions;

  if (!orderId || !Array.isArray(transactions)) {
    throw new Error(`ORDER ID CAN NOT BE BLANK`);
  }

  for (const transaction of transactions) {
    await orderCapture(session, orderId, transaction.id, transaction.amount);
  }

  res.json({});
}

/**
 * getOrderById
 * @param {import('@shopify/shopify-api').Session} session
 * @param {string} id
 */
async function getOrderById(session, id) {
  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: {
      query: `{
  order(id: "${id}") {
    id
    name
    displayFulfillmentStatus
    fulfillable
    displayFinancialStatus
    capturable
    fulfillments(first: 10) {
      id
      createdAt
      deliveredAt
      displayStatus
      status
      trackingInfo {
        number
        company
      }
      service {
        id
        handle
        serviceName
        type
      }
    }
    transactions(first: 10) {
      id
      status
      gateway
      formattedGateway
      kind
      manuallyCapturable
      amountSet {
        presentmentMoney {
          amount
          currencyCode
        }
      }
      parentTransaction {
        id
      }
      paymentDetails {
        ... on CardPaymentDetails {
          avsResultCode
          bin
          company
          cvvResultCode
          expirationMonth
          expirationYear
          name
          number
          paymentMethodName
          wallet
        }
      }
    }
    fulfillmentOrders(first: 10) {
      edges {
        node {
          id
          createdAt
          status
          requestStatus
          supportedActions {
            action
            externalUrl
          }
        }
      }
    }
  }
}
`,
    },
  });

  return response.body.data.order;
}

/**
 * createFulfillment
 * @param {import('@shopify/shopify-api').Session} session
 * @param {string} fulfillmentOrderId
 */
async function createFulfillment(session, fulfillmentOrderId) {
  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: {
      query: `mutation fulfillmentCreateV2($fulfillment: FulfillmentV2Input!) {
  fulfillmentCreateV2(fulfillment: $fulfillment) {
    fulfillment {
      id
      name
      fulfillmentOrders(first: 3, reverse: true) {
        edges {
          node {
            id
            createdAt
            status
            requestStatus
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`,
      variables: {
        fulfillment: {
          lineItemsByFulfillmentOrder: [
            {
              fulfillmentOrderId,
            },
          ],
          trackingInfo: {
            company: "DUMMY SHIPPING CARRIER",
            number: `manual-${Date.now()}`,
            url: "https://sonhp.dev",
          },
        },
      },
    },
  });

  if (response?.body?.data?.fulfillmentCreateV2?.userErrors?.length > 0) {
    throw new Error(
      response?.body?.data?.fulfillmentCreateV2?.userErrors
        ?.map((e) => e.message)
        ?.toString()
    );
  }

  return response?.body?.data?.fulfillmentCreateV2?.fulfillment;
}

/**
 * orderCapture
 * @param {import('@shopify/shopify-api').Session} session
 * @param {string} orderId
 * @param {string} transactionId
 * @param {number} amount
 */
async function orderCapture(session, orderId, transactionId, amount) {
  const client = new shopify.api.clients.Graphql({ session });
  const response = await client.query({
    data: {
      query: `mutation orderCapture($input: OrderCaptureInput!) {
  orderCapture(input: $input) {
    transaction {
      id
      status
      gateway
      kind
    }
    userErrors {
      field
      message
    }
  }
}`,
      variables: {
        input: {
          amount: amount,
          id: orderId,
          parentTransactionId: transactionId,
        },
      },
    },
  });

  if (response?.body?.data?.fulfillmentCreateV2?.userErrors?.length > 0) {
    throw new Error(
      response?.body?.data?.fulfillmentCreateV2?.userErrors
        ?.map((e) => e.message)
        ?.toString()
    );
  }

  return response?.body?.data?.fulfillmentCreateV2?.fulfillment;
}
