import { Page, Layout } from "@shopify/polaris";

export function AppLayout({ children }) {
  return (
    <Page fullWidth>
      <Layout>{children}</Layout>
    </Page>
  );
}
