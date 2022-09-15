import { expect } from 'chai'
import { prettyName } from '../../src/utils/useCases'

describe('useCases/prettyName', () => {
  it('should capitalize first letter', () => {
    expect(prettyName('lowercase')).to.eq('Lowercase')
  })
  it('should put spaces between camel case and lower case other words', () => {
    expect(prettyName('camElcAse')).to.eq('Cam elc ase')
  })
})
