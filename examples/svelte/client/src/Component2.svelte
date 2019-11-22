<script>
    import { get } from "./graphql-svelte/api.js";
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
`
	
	

    let id = 1;
	var res = get(qry);
    $: res2 =get(qry2,{id}); 
</script>


<input type="text" bind:value={id}>
{#await res}
  Loading...
{:then result}
  {#each result.data.launches.launches as launch}
    {launch.id}
  {/each}
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