import { ReactNativeFile } from 'extract-files'
import FormData from 'formdata-node'
import t from 'tap'
import { graphqlFetchOptions } from '../graphqlFetchOptions'

// Global FormData polyfill.
global.FormData = FormData

t.test('graphqlFetchOptions', async t => {
  await t.test('Without files', t => {
    t.deepEquals(
      graphqlFetchOptions({ query: '' }),
      {
        url: '/graphql',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: '{"query":""}'
      },
      'Fetch options'
    )
    t.end()
  })
})
