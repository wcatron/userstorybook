import { expect, test } from '@oclif/test'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

describe('build errors for unknown project', () => {
  test
  .stderr()
  .command(['build', '-c', 'unknown.json'])
  .catch(error => {
    expect(error.message).to.contain(
      'Could not load from unknown.json',
    )
  })
  .it('throws error without valid configuration file location')
})

describe('build example-project', () => {
  test
  .stdout()
  .stderr()
  .command(['build', '-d', join(__dirname, '../../../example-project'), '-c', '.userstorybook.json'])
  .it('logs that it is loading use cases and not log any errors', ctx => {
    expect(ctx.stdout).to.contain('Loading use cases from ')
    expect(ctx.stderr).to.be.eq('')
  })
  it('should match json snapshot', async () => {
    const contents = await readFile(join('../example-project', '.userstorybook', 'output.json'))
    const snapshot = await readFile(join(__dirname, 'snapshots', 'output.json'))
    expect(contents.toString()).to.eq(snapshot.toString())
  })
})
