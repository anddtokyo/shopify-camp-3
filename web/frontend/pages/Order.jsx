import { Button, Card, Layout, Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthenticatedFetch } from "../hooks/index.js";

export default function Order() {
  const fetch = useAuthenticatedFetch();
  const [searchParams] = useSearchParams();
  const id = useMemo(() => searchParams.get("id"), [searchParams]);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState({});

  const createFulfillment = useCallback(() => {
    const fulfillmentOrderIds = order?.fulfillmentOrders?.edges
      ?.map(({ node }) => node.id)
      .join(",");

    setIsLoading(true);
    fetch(`/api/order/fulfill`, {
      method: "POST",
      body: JSON.stringify({ ids: fulfillmentOrderIds }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        getOrder();
        console.log(response);
      })
      .finally(() => setIsLoading(false));
  }, [order]);

  const captureOrder = useCallback(() => {
    const transactions = order.transactions.map((transaction) => {
      return {
        id: transaction.id,
        amount: transaction.amountSet.presentmentMoney.amount,
      };
    });

    setIsLoading(true);
    fetch(`/api/order/capture`, {
      method: "POST",
      body: JSON.stringify({ transactions, orderId: order.id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        getOrder();
        console.log(response);
      })
      .finally(() => setIsLoading(false));
  }, [order]);

  const getOrder = useCallback(() => {
    setIsLoading(true);
    fetch(`/api/order/${id}`, {})
      .then((response) => response.json())
      .then((response) => setOrder(response.order))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    getOrder();
  }, [id]);

  return (
    <Page>
      <TitleBar title={`Order Management`} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            {order && (
              <pre>
                <code>{JSON.stringify(order, undefined, 2)}</code>
              </pre>
            )}
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                justifyItems: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Button primary loading={isLoading} onClick={createFulfillment}>
                Create Fulfillment for Order
              </Button>

              <Button primary loading={isLoading} onClick={captureOrder}>
                Capture this Order
              </Button>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
