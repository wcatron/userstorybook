export type Config = {
  root: string;
  tsConfigFilePath: string;
  skip: string[];
};

export const parseConfig = (configValues: any): Config => {
  // TODO: Validate fields
  return configValues;
};

export const DEFAULT_CONFIG: Config = {
  root: "src/usecases",
  tsConfigFilePath: "tsconfig.json",
  skip: ["*.test.ts"],
};
