<script>
  import Component1 from "./Component1.svelte";
  import Component2 from "./Component2.svelte";
	

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
  
  let name = "World";
  let selected = 1;
</script>

<style>
  .active {
    background-color: #ff3e00;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Visit the
    <a href="https://svelte.dev/tutorial">Svelte tutorial</a>
    to learn how to build Svelte apps.
  </p>
</main>

<div style="display:flex; ">
  <button
    class:active={selected === 1}
    on:click={() => (selected = 1)}
    style="margin-left: 5px; border: 1px solid black">
    first page
  </button>
  <button
    on:click={() => (selected = 2)}
    class:active={selected === 2}
    style="margin-left: 5px; border: 1px solid black">
    second page
  </button>
</div>

{#if selected ==1}
	 <Component1 />
{:else}
	 <Component2/>
	 <Component2/>
{/if}
