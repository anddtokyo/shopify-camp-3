import { Page, Layout } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { OrdersTable } from "../components/ProductTable";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title={"Demetio product viewer app"} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <OrdersTable />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
