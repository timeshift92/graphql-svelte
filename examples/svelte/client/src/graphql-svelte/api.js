  
  import graphql,{fetchOptionsOverride} from "./config";
  import { graphqlFetchOptions,hashObject  } from "grpahql-svelte";


  graphql.on('cache', onCache)

  function onCache({ cacheKey: cachedCacheKey, cacheValue }) {
   
  }
  let get = async (query,variables) => {
    const fetchOptions = graphqlFetchOptions({
      query,
      variables
    });
    fetchOptionsOverride(fetchOptions)
    const has = hashObject(fetchOptions);
    if(graphql.cache[has])
    return new Promise((resolve, reject) => {
        resolve(graphql.cache[has]);
    });
    const pending = graphql.operate({
      fetchOptionsOverride,
      operation: {
        query,
        variables
      }
    });
      return  pending.cacheValuePromise
  }
  
  
  export  {get};