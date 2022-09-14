import { expect, test } from '@oclif/test'

describe('build', () => {
  test
  .stderr()
  .command(['build'])
  .catch(error => {
    expect(error.message).to.contain(
      'Could not load local configuration from file',
    )
  })
  .it('throws error without valid configuration file location')
})
