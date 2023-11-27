import {
  Banner,
  useApi,
  reactExtension,
  useSubtotalAmount,
  Text,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const { shop } = useApi();
  const amount = useSubtotalAmount();

  return (
    <Banner title="This banner is from Checkout UI">
      <Text>
        Thanks for purchasing {amount.amount} {amount.currencyCode} from our
        shop <Text emphasis="bold">{shop.name}</Text>
      </Text>
    </Banner>
  );
}
