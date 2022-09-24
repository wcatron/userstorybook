/* eslint-disable @typescript-eslint/no-unused-vars */
import path = require('path');
import { SourceFile, SyntaxKind, ts, Type, Node, VariableDeclaration, TypeFormatFlags } from 'ts-morph'
import minimatch = require('minimatch');
import { footprintOfType, isPromise } from './ts-morph-utils';

export type ParsedUseCaseType = { name: string, type: string, async?: boolean, children?: ParsedUseCaseType }[]

export type ParsedUseCase = {
  fileName: string;
  name: string;
  namePretty: string;
  code: string;
  returns: ParsedUseCaseType
  inputs: ParsedUseCaseType
  context: ParsedUseCaseType
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
    const initializer = useCaseFn.getInitializerIfKindOrThrow(SyntaxKind.FunctionExpression)
    return initializer.getText()
  } catch (error) {
    console.error(error)
  }
}

function parseType(type: Type<ts.Type>, parentNode: Node<ts.Node>, async = false): ParsedUseCaseType | undefined {
  if (type.isArray()) {
    return []
  }

  if (type.isString()) {
    return []
  }

  if (type.isObject()) {
    if (isPromise(type)) {
      const first = type.getTypeArguments()[0];
      return parseType(first, parentNode, true)
    }

    return type.getProperties().map(prop => {
      return {
        name: prop.getName(),
        type: prop.getTypeAtLocation(parentNode).getText(parentNode, TypeFormatFlags.UseAliasDefinedOutsideCurrentScope),
        children: parseType(prop.getTypeAtLocation(parentNode), parentNode),
        async
      }
    })
  }

  return [{
    name: 'default',
    type: type.getText(parentNode),
    async
  }]
}

export function getUseCaseElements(
  useCaseFn?: VariableDeclaration
): Pick<ParsedUseCase, 'returns' | 'inputs' | 'context'> {
  if (!useCaseFn) {
    throw new Error('Missing use case function')
  }
  if (useCaseFn.getType().getAliasSymbol()?.getEscapedName() !== 'UseCase') {
    throw new Error('Getting elements for type that is not a use case')
  }

  const initializer = useCaseFn.getInitializerIfKindOrThrow(SyntaxKind.FunctionExpression)
  const callSignature = useCaseFn?.getType().getCallSignatures()[0]
  const returnType = callSignature.getReturnType()
  const [inputParameter, contextParameter] = initializer.getParameters()
  const inputType = inputParameter.getType()
  const contextType = contextParameter.getType()

  const inputs = parseType(inputType, initializer) || []
  const context = parseType(contextType, initializer) || []

  return {
    returns: parseType(returnType, initializer) || [],
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

    const elements = getUseCaseElements(variableDecleration)
    return {
      fileName,
      name: fnName,
      namePretty: prettyName(fnName),
      code: getCode(variableDecleration) || 'Unable to process code',
      ...elements,
    }
  }
}
