/* eslint-disable @typescript-eslint/no-unused-vars */
import path = require('path');
import { SourceFile, VariableDeclaration } from 'ts-morph'
import minimatch = require('minimatch');

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

export function getInputs(
  useCaseFn: VariableDeclaration,
  sourceFile: SourceFile,
) {
  if (useCaseFn.getType().getAliasSymbol()?.getEscapedName() !== 'UseCase') {
    throw new Error('Getting inputs for type that is not a use case')
  }

  const initializer = useCaseFn.getInitializer()
  const callSignature = useCaseFn?.getType().getCallSignatures()[0]
  const returnType = callSignature.getReturnType()
  const input = callSignature.getParameters()[0]
  const context = callSignature.getParameters()[1]
  console.log('returnType', returnType.getText())
  console.log('input', useCaseFn?.getType().getCallSignatures())
  /* if (initializer && isCallExpression(initializer) && initializer.typeArguments?.length) {
      const inputs = initializer.typeArguments[0]
      if ((inputs && isTypeLiteralNode(inputs)) || isInterfaceDeclaration(inputs)) {
        return inputs.members.map((member) => member.getText(sourceFile).trim())
      } else if (isTypeReferenceNode(inputs)) {
        const type = program.getTypeChecker().getTypeAtLocation(inputs)
        const symbol = type.symbol || type.aliasSymbol
        const decls = symbol.getDeclarations() as ts.Declaration[]
        const followedInputs = decls[0]
        // Probably some way to recurrsively do this.
        if (isTypeLiteralNode(followedInputs) || isInterfaceDeclaration(followedInputs)) {
          return followedInputs.members.map((member) => member.getText().trim())
        }
      }
      return null
    } else {
      return null
    } */
}

export function parseUseCase(skip: string[]) {
  return (sourceFile: SourceFile): ParsedUseCase | undefined => {
    const fileName = path.basename(sourceFile.getBaseName())
    if (skip.some(pattern => minimatch(fileName, pattern))) {
      return undefined
    }

    const fnName = fileName.slice(
      0,
      Math.max(0, fileName.length - path.extname(fileName).length),
    )
    const variableDecleration = sourceFile.getVariableDeclaration(fnName)
    if (!variableDecleration) {
      console.error(`Could not process file ${fileName}`)
      throw new Error('Abort: Use case file did not contain project file')
    }

    console.log(`Processing file ${fileName}`)
    getInputs(variableDecleration, sourceFile)
    return {
      fileName,
      name: fnName,
      namePretty: prettyName(fnName),
      code: getCode(variableDecleration) || 'Unable to process code',
    }
  }
}
