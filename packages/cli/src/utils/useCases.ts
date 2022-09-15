/* eslint-disable @typescript-eslint/no-unused-vars */
import path = require('path');
import { SourceFile, SyntaxKind, VariableDeclaration } from 'ts-morph'
import minimatch = require('minimatch');

export type ParsedUseCase = {
  fileName: string;
  name: string;
  namePretty: string;
  code: string;
  returns: string;
  inputs: { name: string, type: string }[]
  context: { name: string, type: string }[]
};

export function prettyName(useCaseFnName: string) {
  return (
    useCaseFnName
    // This could be improved
    .replace(/(?<=.)([A-Z](?=[a-z]))/gm, match => {
      return ' ' + match.toLowerCase()
    })
    .replace(/^([A-Za-z])/, match => {
      return ' ' + match.toUpperCase()
    })
    .trim()
  )
}

function getCode(useCaseFn: VariableDeclaration) {
  try {
    return useCaseFn.getText()
  } catch (error) {
    console.error(error)
  }
}

export function getUseCaseElements(
  useCaseFn: VariableDeclaration,
  sourceFile: SourceFile,
): Pick<ParsedUseCase, 'returns' | 'inputs' | 'context'> {
  if (useCaseFn.getType().getAliasSymbol()?.getEscapedName() !== 'UseCase') {
    throw new Error('Getting elements for type that is not a use case')
  }

  const initializer = useCaseFn.getInitializerIfKindOrThrow(SyntaxKind.FunctionExpression)
  const callSignature = useCaseFn?.getType().getCallSignatures()[0]
  const returnType = callSignature.getReturnType()
  const [inputParameter, contextParameter] = initializer.getParameters()
  const inputType = inputParameter.getType()
  const contextType = contextParameter.getType()

  const inputs = inputType.getProperties().map(prop => {
    return {
      name: prop.getName(),
      type: prop.getTypeAtLocation(initializer).getText(),
    }
  })

  const context = contextType.getProperties().map(prop => {
    return {
      name: prop.getName(),
      type: prop.getTypeAtLocation(initializer).getText(),
    }
  })

  return {
    returns: returnType.getText(),
    inputs,
    context,
  }
}

export function determineFnName(fileName: string) {
  return fileName.slice(
    0,
    Math.max(0, fileName.length - path.extname(fileName).length),
  )
}

export function getUseCaseVariableDefinition(sourceFile: SourceFile) {
  const fileName = path.basename(sourceFile.getBaseName())
  const fnName = determineFnName(fileName)
  return {
    variableDeclaration: sourceFile.getVariableDeclaration(fnName),
    fnName,
  }
}

export function parseUseCase(skip: string[]) {
  return (sourceFile: SourceFile): ParsedUseCase | undefined => {
    const fileName = path.basename(sourceFile.getBaseName())
    if (skip.some(pattern => minimatch(fileName, pattern))) {
      return undefined
    }

    const { variableDeclaration: variableDecleration, fnName } = getUseCaseVariableDefinition(sourceFile)
    if (!variableDecleration) {
      console.error(`Could not process file ${fileName}`)
      throw new Error('Abort: Use case file did not contain project file')
    }

    const elements = getUseCaseElements(variableDecleration, sourceFile)
    return {
      fileName,
      name: fnName,
      namePretty: prettyName(fnName),
      code: getCode(variableDecleration) || 'Unable to process code',
      ...elements,
    }
  }
}
