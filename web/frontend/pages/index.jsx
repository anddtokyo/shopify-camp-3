import { Page, Layout, List, Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title={"Demetio multi-extensions app"} primaryAction={null} />
      <Layout>
        <Layout.Section>
          <List>
            <List.Item>
              <Link url="/theme-app">Theme app extension and proxy</Link>
            </List.Item>
            <List.Item>
              <Link url="/checkout-ui">Checkout UI extension</Link>
            </List.Item>
            <List.Item>
              <Link url="/shopify-function">Shopify functions</Link>
            </List.Item>
          </List>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
