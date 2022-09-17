import { Command, Flags } from '@oclif/core'
import { readFile } from 'node:fs/promises'
import { Config, DEFAULT_CONFIG, parseConfig } from '../config'
import { FileDataSourceReal } from '../datasources/fileDataSource'
import { TemplatesDataSourceReal } from '../datasources/templatesDataSource'
import { buildUserStoryBook } from '../useCases/buildUserStoryBook'

export default class Build extends Command {
  static description =
    'Builds your user storybook according to your configuration.';

  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    // flag with a value (-n, --name=VALUE)
    config: Flags.string({
      char: 'c',
      description: 'Path to configuration file',
      default: '.userstorybook.json',
    }),
    // flag with a value (-n, --name=VALUE)
    directory: Flags.string({
      char: 'd',
      required: false,
      description: 'Path to project directory (useful for testing)',
    }),
    // flag with a value (-n, --name=VALUE)
    output: Flags.string({
      char: 'o',
      description: 'Path to storybook output directory',
      default: '.userstorybook',
    }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
    verbose: Flags.boolean({ char: 'v' }),
    jsonOnly: Flags.boolean(),
  };

  static args = [{ name: 'file' }];

  protected async importConfig(filename: string): Promise<Partial<Config>> {
    const contents = await readFile(filename, 'utf8')
    return parseConfig(JSON.parse(contents))
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Build)

    const configFilename = flags.config

    if (flags.directory) {
      // This seems like a potentially bad idea but not sure why
      // Could not get tests to run, @oclif/test seems to change the working directory
      process.chdir(flags.directory)
    }

    let config: Config = DEFAULT_CONFIG
    try {
      if (flags.verbose) this.log(`Attempting to get config from ${configFilename} in ${process.cwd()}`)
      const localConfig = await this.importConfig(configFilename)
      config = {
        ...config,
        ...localConfig,
      }
      if (flags.verbose) this.log(`Configuration imported: ${JSON.stringify(this.config)}`)
    } catch (error: any) {
      this.error(`Could not load from ${configFilename} in ${process.cwd()}`, error)
    }

    if (flags.verbose) this.log('Loading templating engine...')
    const files = new FileDataSourceReal()
    const templates = new TemplatesDataSourceReal()
    await templates.load()
    return buildUserStoryBook(
      { config, flags },
      {
        files,
        templates,
        logger: this,
      },
    )
  }
}
