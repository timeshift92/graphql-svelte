<script>
  import { get, subscribe } from "./graphql-svelte/api.js";
  const qry = `
	{
  launches{
    cursor
    launches{
      id
      
    }
  }
}
`;

  const qry2 = `
{
  launch(id:84){
    id
    site
  }
}


`;
  var data = {
    id: "1",
    type: "start",
    payload: {
      variables: {
        user_id: "eff8b110-2724-4e69-8a38-74f68024f78f",
        locales_id: 1
      },
      extensions: {},
      operationName: null,
      query:
        "subscription ($user_id: uuid, $locales_id: Int) {\n  favorites_aggregate(where: {user_id: {_eq: $user_id}}) {\n    nodes {\n      product {\n        product_locales(where: {locales_id: {_eq: $locales_id}}) {\n          name\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    aggregate {\n      count\n      __typename\n    }\n    __typename\n  }\n}\n"
    }
  };
  const rr = subscribe(data.payload);
  let id = 1;
  var res = get(qry);
  $: res2 = get(qry2, { id });
</script>

{#await $rr}
  Loading
{:then value}
  {JSON.stringify(value)}
{:catch error}
  <!-- $rr was rejected -->
{/await}

<input type="text" bind:value={id} />
{#await res}
  Loading...
{:then result}
  {#each result.data.launches.launches as launch}{launch.id}{/each}
{:catch error}
  Error: {error}
{/await}

{#await res2}
  Loading...
{:then result}
  {result.data.launch.id}
{:catch error}
  Error: {error}
{/await}
