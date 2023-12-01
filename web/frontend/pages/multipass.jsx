import {
  Button,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  TextField,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../hooks/index.js";
import { Redirect } from "@shopify/app-bridge/actions";

export default function Multipass() {
  const fetch = useAuthenticatedFetch();
  const app = useAppBridge();
  const [isLoading, setIsLoading] = useState(false);
  const [secret, setSecret] = useState("");
  const [signInUrl, setSignInUrl] = useState(null);

  const handleSubmit = useCallback(() => {
    if (!secret) {
      return;
    }

    setIsLoading(true);

    fetch("/api/multipass/secret", {
      method: "POST",
      body: JSON.stringify({ secret }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setSecret(response.secret);
        setSignInUrl(response.signInUrl);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [secret]);

  const handleSecretChange = useCallback((value) => setSecret(value), []);

  const signIn = useCallback(() => {
    const redirect = Redirect.create(app);
    redirect.dispatch(Redirect.Action.REMOTE, decodeURIComponent(signInUrl));
  }, [signInUrl]);

  useEffect(() => {
    setIsLoading(true);

    fetch("/api/multipass/secret", {})
      .then((response) => response.json())
      .then((response) => {
        setSecret(response.secret);
        setSignInUrl(response.signInUrl);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <Page>
      <TitleBar title={`Multipass Settings`} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  value={secret}
                  onChange={handleSecretChange}
                  label="MULTIPASS SECRET"
                  type="text"
                  placeholder={`multipass secret ...`}
                  autoComplete={"multipass_secret"}
                  requiredIndicator={true}
                />
                <Button
                  submit
                  primary={true}
                  disabled={isLoading || !secret}
                  textAlign={`center`}
                  loading={isLoading}
                >
                  Submit
                </Button>
              </FormLayout>
            </Form>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <Button
              primary={true}
              textAlign={`center`}
              disabled={!signInUrl}
              onClick={signIn}
            >
              Login via Multipass
            </Button>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
