import shopify from "../shopify.js";

export class ProductService {
  graphqlClient;

  constructor(session) {
    this.graphqlClient = new shopify.api.clients.Graphql({
      session,
    });
  }

  async getProducts(createdAtMin, createdAtMax) {
    try {
      const response = await this.graphqlClient.query({
        data: `query {
          products(first: 250, query: "created_at:>${createdAtMin} AND created_at:<${createdAtMax}") {
            edges {
              node {
                title
                status
                description
                createdAt
              }
            }
          }
        }`,
      });

      return response.body.data.products.edges.map((edge) => edge.node);
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
