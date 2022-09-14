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
    output: Flags.string({
      char: 'o',
      description: 'Path to storybook output directory',
      default: '.userstorybook',
    }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: 'f' }),
    verbose: Flags.boolean({ char: 'v' }),
  };

  static args = [{ name: 'file' }];

  protected async importConfig(filename: string): Promise<Partial<Config>> {
    const contents = await readFile(filename, 'utf8')
    return parseConfig(JSON.parse(contents))
  }

  userStorybookConfig: Config = DEFAULT_CONFIG;

  public async run(): Promise<void> {
    const { flags } = await this.parse(Build)

    const configFilename = flags.config

    try {
      const localConfig = await this.importConfig(configFilename)
      this.userStorybookConfig = {
        ...DEFAULT_CONFIG,
        ...localConfig,
      }
    } catch {
      this.error(
        'Could not load local configuration from filename: ' + configFilename,
      )
    }

    const files = new FileDataSourceReal()
    const templates = new TemplatesDataSourceReal()
    await templates.load()
    return buildUserStoryBook(
      { config: this.userStorybookConfig, flags },
      {
        files,
        templates,
        logger: this,
      },
    )
  }
}
