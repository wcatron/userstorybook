import { expect } from 'chai'
import { join } from 'node:path'
import { Project } from 'ts-morph'
import { getUseCaseElements, getUseCaseVariableDefinition, prettyName } from '../../src/utils/useCases'

describe('useCases/prettyName', () => {
  it('should capitalize first letter', () => {
    expect(prettyName('lowercase')).to.eq('Lowercase')
  })
  it('should put spaces between camel case and lower case other words', () => {
    expect(prettyName('camElcAse')).to.eq('Cam elc ase')
  })
})

describe('useCases/getUseCaseVariableDefinition', () => {
  const project = new Project()
  it('should get variable definition from source file', () => {
    const sourceFile = project.createSourceFile('temp/testUseCase.ts', 'const testUseCase = () => void')
    const { fnName, variableDeclaration } = getUseCaseVariableDefinition(sourceFile)
    expect(fnName).to.eq('testUseCase')
    expect(variableDeclaration).to.be.an('object')
  })
  it('should return null for misnamed function', () => {
    const sourceFile = project.createSourceFile('temp/badUseCase.ts', 'const badUseCaseName = () => void')
    const { fnName, variableDeclaration } = getUseCaseVariableDefinition(sourceFile)
    expect(fnName).to.eq('badUseCase')
    expect(variableDeclaration).to.be.undefined
  })
})

describe('useCases/getInputs', () => {
  const project = new Project()
  project.addSourceFilesAtPaths(join(__dirname, 'examples', '**'))
  it('should get inputs and contexts', () => {
    const sourceFile = project.getSourceFile('exampleUseCase.ts')!
    const { variableDeclaration } = getUseCaseVariableDefinition(sourceFile)
    const inputs = getUseCaseElements(variableDeclaration!, sourceFile)
    expect(inputs.returns[0].type).to.eq('boolean')
    expect(inputs.inputs).to.deep.eq([{ name: 'id', type: 'string', children: [] }])
    expect(inputs.context).to.deep.eq([{
      name: 'auth', type: 'AuthContext', children: [{
        name: 'id',
        type: 'string',
        children: [],
      }],
    }])
  })
  it('should allow type passed in generic', () => {
    const sourceFile = project.getSourceFile('exampleUseCase2.ts')!
    const { variableDeclaration } = getUseCaseVariableDefinition(sourceFile)
    const inputs = getUseCaseElements(variableDeclaration!, sourceFile)
    expect(inputs.returns[0].type).to.eq('boolean')
    expect(inputs.inputs).to.deep.eq([{ name: 'id', type: 'string', children: [] }])
    expect(inputs.context).to.deep.eq([{
      name: 'auth', type: 'AuthContext', children: [
        {
          name: 'id',
          type: 'string',
          children: [],
        },
      ],
    }])
  })
})
