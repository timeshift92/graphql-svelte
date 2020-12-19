import { GraphQL } from "graphql-svelte";
import { svqlConfig, SvGraphQL } from "../../../../../src";
const client = svqlConfig()
client.on
  const graphql = new GraphQL();
  const fetchOptionsOverride = options => {
    (options.url = "http://localhost:4001/graphql"),
      (options.headers = {
        "content-type": "application/json",
      });
  };

  export {
    fetchOptionsOverride
  }
  export default graphql;
