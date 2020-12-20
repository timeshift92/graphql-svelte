import FormData from 'formdata-node'
import { hashObject } from '../src/hashObject'

// Global FormData polyfill.
//@ts-ignore
global.FormData = FormData

describe('hashObject() with an object', () => {
  const object = { a: 1, b: 2 }

  const hash1 = hashObject(object)
  it('Hash type', () => {
    expect(typeof hash1 == 'string').toBeTruthy()
  })

  const hash2 = hashObject(object)

  it('Deterministic hash', () => {
    expect(hash1).toEqual(hash2)
  })
  object.b = 3

  const hash3 = hashObject(object)

  it('Property values affect the hash', () => {
    expect(hash2 !== hash3).toBeTruthy()
  })

})

describe('hashObject() with a FormData instance', () => {
  const form1 = new FormData()
  const form2 = new FormData()
  form1.append('1', 'a')
  form2.append('1', 'b')

  const hash1 = hashObject(form1)
  const hash2 = hashObject(form1)
  const hash3 = hashObject(form2)
  it('Hash type',()=>{
    expect(typeof hash1 =='string' ).toBeTruthy()
  })
  it('Deterministic hash',()=>{
    expect(hash1 ).toEqual(hash2)
  })

  it('Fields determine hash',()=>{
    expect(hash2 == hash3 ).toEqual(false)
  })

})

