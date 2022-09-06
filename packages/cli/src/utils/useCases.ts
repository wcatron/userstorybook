import path = require("path");
import { SourceFile, SyntaxKind, VariableDeclaration } from "ts-morph";
import minimatch = require("minimatch");

export type ParsedUseCase = {
  fileName: string;
  name: string;
  namePretty: string;
  code: string;
};

function prettyName(useCaseFnName: string) {
  return (
    useCaseFnName
      // This could be improved
      .replace(/(?<=.)([A-Z](?=[a-z]))/gm, (match) => {
        return " " + match.toLowerCase();
      })
      .replace(/^([a-zA-Z])/, (match) => {
        return " " + match.toUpperCase();
      })
      .trim()
  );
}

function getCode(useCaseFn: VariableDeclaration) {
  try {
    return useCaseFn.getText();
  } catch (e) {
    console.error(e);
  }
}

export function parseUseCase(skip: string[]) {
  return (sourceFile: SourceFile): ParsedUseCase | undefined => {
    const fileName = path.basename(sourceFile.getBaseName());
    if (skip.find((pattern) => minimatch(fileName, pattern))) {
      return undefined;
    }
    const fnName = fileName.substring(
      0,
      fileName.length - path.extname(fileName).length
    );
    const variableDecleration = sourceFile.getVariableDeclaration(fnName);
    if (!variableDecleration) {
      console.error(`Could not process file ${fileName}`);
      throw new Error("Abort: Use case file did not contain project file");
    }
    console.log(`Processing file ${fileName}`);
    return {
      fileName,
      name: fnName,
      namePretty: prettyName(fnName),
      code: getCode(variableDecleration) || "Unable to process code",
    };
  };
}
