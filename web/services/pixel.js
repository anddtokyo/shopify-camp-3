import shopify from "../shopify.js";

export default class PixelService {
  graphqlClient;

  constructor(session) {
    this.graphqlClient = new shopify.api.clients.Graphql({
      session,
    });
  }

  async createPixel() {
    try {
      const response = await this.graphqlClient.query({
        data: `mutation {
        webPixelCreate(webPixel: { settings: { accountID : "234" } }) {
          userErrors {
            code
            field
            message
          }
          webPixel {
            settings
            id
          }
        }
      }`,
      });
      console.log(response.body.data.webPixelCreate);
    } catch (e) {
      console.log(e);
    }
  }
}
