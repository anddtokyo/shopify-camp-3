import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useCallback, useState } from "react";
import { useAuthenticatedFetch } from "../hooks/index.js";

export default function Fulfillment() {
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false);
  const [adjustQuantities, setAdjustQuantities] = useState(10);

  const handleSubmit = useCallback(() => {
    setIsLoading(true);
    fetch("/api/inventory-adjust-quantities", {
      method: "POST",
      body: JSON.stringify({ quantities: adjustQuantities }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(console.log)
      .finally(() => setIsLoading(false));
  }, [adjustQuantities]);

  const handleAdjustQuantitiesChange = useCallback((value) => {
    setAdjustQuantities(parseInt(value, 10));
  }, []);

  const register = useCallback(() => {
    setIsLoading(true);
    fetch("/api/fulfillment/register", { method: "POST" })
      .then((response) => response.json())
      .then(console.log)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Page>
      <TitleBar title={`Fulfillment Settings`} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Button
              primary={true}
              textAlign={`center`}
              loading={isLoading}
              onClick={register}
            >
              Register Fulfillment Service
            </Button>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={adjustQuantities.toString()}
                  onChange={handleAdjustQuantitiesChange}
                  label="Adjust Quantities"
                  type="number"
                  min={1}
                  autoComplete="off"
                />

                <Button submit primary={true} loading={isLoading}>
                  Add
                </Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
