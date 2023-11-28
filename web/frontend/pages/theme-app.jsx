import { IndexTable, List, Text } from "@shopify/polaris";
import { AppLayout } from "../components/Layout";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";

export default function ThemeAppExtension() {
  const authenticatedFetch = useAuthenticatedFetch();
  const [trackingData, setTrackingData] = useState([]);

  const fetchTrackingData = async () => {
    const data = await authenticatedFetch("/api/tracking").then((res) =>
      res.json()
    );
    const rowMarkup = data.map(({ id, custom_text, created_at }, index) => (
      <IndexTable.Row id={id} key={id} position={index}>
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {custom_text}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{created_at}</IndexTable.Cell>
      </IndexTable.Row>
    ));
    setTrackingData(rowMarkup);
  };

  useEffect(() => {
    fetchTrackingData();
  }, []);

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
            To view custom theme app extension and interact with app proxy:
          </Text>
        </div>
        <List>
          <List.Item>
            Go to your{" "}
            <b>
              Shopify Partners {">"} Apps {">"} exercise-5 {">"} App setup {">"}{" "}
              App proxy.
            </b>
          </List.Item>
          <List.Item>
            Set Subpath prefix to <b>apps.</b>
          </List.Item>
          <List.Item>
            Set Subpath to <b>exercise-5.</b>
          </List.Item>
          <List.Item>
            Set Proxy URL to{" "}
            <b>
              https://uc-predictions-solely-bahrain.trycloudflare.com/api/proxy.
            </b>
          </List.Item>
          <List.Item>
            Go to <b>Online Store {">"} Theme.</b>
          </List.Item>
          <List.Item>
            Select a theme and press <b>Customize</b>.
          </List.Item>
          <List.Item>
            Select <b>+ Add section</b>.
          </List.Item>
          <List.Item>
            Select <b>Apps</b> tab and <b>Custom text</b>.
          </List.Item>
          <List.Item>Set your text, color and font size.</List.Item>
          <List.Item>
            Press <b>Send this text to app</b> and the text will be displayed in
            the table below.
          </List.Item>
        </List>

        <div style={{ marginTop: "20px" }}>
          <IndexTable
            selectable={false}
            itemCount={trackingData.length}
            headings={[{ title: "Text" }, { title: "Sent at" }]}
          >
            {trackingData}
          </IndexTable>
        </div>
      </div>
    </AppLayout>
  );
}
