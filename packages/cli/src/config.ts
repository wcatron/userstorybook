export type Config = {
  output: string;
  root: string;
  tsConfigFilePath: string;
  skip: string[];
};

export const parseConfig = (configValues: unknown): Config => {
  // TODO: Validate fields
  return configValues as Config
}

export const DEFAULT_CONFIG: Config = {
  root: 'src/usecases',
  output: '.userstorybook',
  tsConfigFilePath: 'tsconfig.json',
  skip: ['*.test.ts'],
}
