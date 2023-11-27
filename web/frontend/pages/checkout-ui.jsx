import { List, Text } from "@shopify/polaris";
import { AppLayout } from "../components/Layout";

export default function CheckoutUIExtension() {
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
          <Text variant="headingXl">To view Checkout UI extension:</Text>
        </div>
        <List>
          <List.Item>Go to checkout page.</List.Item>
          <List.Item>
            You will see a banner with content: Thanks for purchasing{" "}
            {"{ amount }"} from our shop {"{ shop name }"}.
          </List.Item>
        </List>
      </div>
    </AppLayout>
  );
}
