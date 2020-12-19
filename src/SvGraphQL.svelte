<script>
  export let hasura
  export let client

  import { setContext } from 'svelte'

  setContext('api', {
    query: client.query,
    mutate: client.mutate,
    subscription: client.subscription,
    client,
    hasura
  })
</script>

<slot />
