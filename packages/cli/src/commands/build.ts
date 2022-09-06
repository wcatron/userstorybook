import { Command, Flags } from "@oclif/core";
import { readFileSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import Handlebars = require("handlebars");
import path = require("path");
import { Project } from "ts-morph";
import { Config, DEFAULT_CONFIG, parseConfig } from "../config";
import { ParsedUseCase, parseUseCase } from "../utils/useCases";

export default class Build extends Command {
  static description =
    "Builds your user storybook according to your configuration.";

  static examples = ["<%= config.bin %> <%= command.id %>"];

  static flags = {
    // flag with a value (-n, --name=VALUE)
    config: Flags.string({
      char: "c",
      description: "Path to configuration file",
      default: ".userstorybook.json",
    }),
    // flag with no value (-f, --force)
    force: Flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  protected importConfig(filename: string): Partial<Config> {
    const contents = readFileSync(filename, "utf8");
    return parseConfig(JSON.parse(contents));
  }

  userStorybookConfig: Config = DEFAULT_CONFIG;

  protected loadUseCases() {
    this.log(
      `Loading use cases from '${process.cwd()}/${
        this.userStorybookConfig.root
      }'`
    );
    const { tsConfigFilePath, root, skip } = this.userStorybookConfig;
    const project = new Project({
      tsConfigFilePath,
    });
    const rootDirectory = project.getDirectory(root);

    if (!rootDirectory) {
      throw new Error(`Could not load project at root: ${root}`);
    }
    const useCases = rootDirectory
      .getSourceFiles()
      .map(parseUseCase(skip))
      .filter((a): a is ParsedUseCase => a !== undefined);

    console.log(JSON.stringify(useCases, undefined, 2));

    return useCases;
  }

  protected async writeUseCases(useCases: ParsedUseCase[]) {
    const indexTemplateString = await readFile(
      path.join(__dirname, "../../template/index.hbs")
    ).then((buffer) => buffer.toString());
    const templateString = await readFile(
      path.join(__dirname, "../../template/useCase.hbs")
    ).then((buffer) => buffer.toString());
    const pageTemplate = Handlebars.compile(indexTemplateString);
    Handlebars.registerHelper("isEqual", function (value1, value2) {
      return value1 === value2;
    });
    Handlebars.registerPartial("useCase", templateString);

    try {
      await mkdir(".storybook", {});
    } catch (e) {}

    for (const useCase of useCases) {
      const result = pageTemplate({
        useCase,
        useCases,
      });
      writeFile(`.storybook/${useCase.name}.html`, result);
    }
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Build);

    const configFilename = flags.config;

    this.log(`Building user storybook using config from: ${configFilename}`);

    this.userStorybookConfig = {
      ...DEFAULT_CONFIG,
      ...this.importConfig(configFilename),
    };

    const useCases = this.loadUseCases();
    this.writeUseCases(useCases);
  }
}
