import { List, Text } from "@shopify/polaris";
import { AppLayout } from "../components/Layout";

export default function ShopifyFunctionExtension() {
  return (
    <AppLayout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "20px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <Text variant="headingXl">
            We implemented a function which throws an error when <br /> there is
            a product that has more than 5 items in checkout process.
            <br /> Here's how to enable and test it:
          </Text>
        </div>
        <List>
          <List.Item>
            From the Shopify admin, go to <b>Settings {">"} Checkout</b>
          </List.Item>
          <List.Item>
            In the Checkout Rules section of the page click <b>Add rule</b>.
          </List.Item>
          <List.Item>
            Select <b>cart-checkout-validation</b>
          </List.Item>
          <List.Item>
            Next to the installed validation, click ..., and click{" "}
            <b>Activate</b> to activate the function.
          </List.Item>
          <List.Item>
            Go to online store, add a product to cart and increase its quantity.
          </List.Item>
          <List.Item>
            If the quantity exceeds 5 items, an error message will show up.
          </List.Item>
        </List>
      </div>
    </AppLayout>
  );
}
