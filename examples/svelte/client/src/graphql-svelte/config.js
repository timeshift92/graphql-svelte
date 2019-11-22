import { GraphQL } from "grpahql-svelte/src/index";
  const graphql = new GraphQL();
  const fetchOptionsOverride = options => {
    (options.url = "http://localhost:4000/graphql"),
      (options.headers = {
        "content-type": "application/json",
      });
  };

  export {
    fetchOptionsOverride
  }
  export default graphql;