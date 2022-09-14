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
  { config: { tsConfigFilePath, root, skip, output }, flags: { verbose } },
  { files, templates, logger },
) => {
  logger.log(`Loading use cases from '${process.cwd()}/${root}'`)
  const project = new Project({
    tsConfigFilePath,
  })
  const rootDirectory = project.getDirectory(root)

  if (!rootDirectory) {
    throw new Error(`Could not load project at root: ${root}`)
  }

  const useCases = rootDirectory
  .getSourceFiles()
  .map(parseUseCase(skip))
  .filter((a): a is ParsedUseCase => a !== undefined)

  if (verbose) console.log(JSON.stringify(useCases, undefined, 2))

  await files.prepDirectory(output)

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
