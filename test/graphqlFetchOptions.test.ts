import FormData from 'formdata-node'
import { graphqlFetchOptions } from '../src/graphqlFetchOptions'

// Global FormData polyfill.
//@ts-ignore
global.FormData = FormData

describe('graphqlFetchOptions', () => {
  test('Without files', () => {
    expect(graphqlFetchOptions({ query: '' }))
      .toEqual(
        {
          url: '/graphql',
          method: 'POST',
          credentials:'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: '{"query":""}',
        })
  })
})
