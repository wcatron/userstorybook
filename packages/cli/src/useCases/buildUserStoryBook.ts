import { UseCase } from '@userstorybook/core'
import { join } from 'node:path'
import { Project } from 'ts-morph'
import { ParsedUseCase, parseUseCase } from '../utils/useCases'

export interface FileDataSourceI {
  // Should make the directory if it doesn't exist or empty it if it does
  prepDirectory: (directory: string) => Promise<void>;
  writeFile: (filePath: string, contents: string) => Promise<void>;
}

interface LogInterface {
  log: (message: string) => void;
}

export interface TemplatesDataSourceI {
  generate: ({
    useCase,
  }: {
    useCase: ParsedUseCase;
    useCases: ParsedUseCase[];
  }) => string;
}

export type Config = {
  output: string;
  root: string;
  tsConfigFilePath: string;
  skip: string[];
};

export type Flags = {
  verbose: boolean;
  jsonOnly: boolean;
};

export const buildUserStoryBook: UseCase<
  { config: Config; flags: Flags },
  {
    files: FileDataSourceI;
    logger: LogInterface;
    templates: TemplatesDataSourceI;
  },
  Promise<void>
> = async (
  { config: { root, skip, output }, flags: { verbose, jsonOnly } },
  { files, templates, logger },
) => {
  logger.log(`Loading use cases from '${process.cwd()}/${root}'`)
  // TODO: Add tsConfigFilePath back, currently it causes imports to be added in front of types
  const project = new Project()
  const useCases = project.addSourceFilesAtPaths(`${root}/**`).map(parseUseCase(skip))
  .filter((a): a is ParsedUseCase => a !== undefined)

  if (verbose) console.log(JSON.stringify(useCases, undefined, 2))

  await files.prepDirectory(output)

  files.writeFile(join(output, 'output.json'), JSON.stringify(useCases, undefined, 4))

  if (jsonOnly) {
    return
  }

  await Promise.allSettled(useCases.map(async useCase => {
    const result = templates.generate({
      useCase,
      useCases,
    })
    const filePath = join(output, `${useCase.name}.html`)
    if (verbose)
      console.log(`Generated result for ${useCase.namePretty}: ${filePath}`)

    await files.writeFile(filePath, result)
  }))
}
