import { expect } from 'chai'
import { readFileSync } from 'node:fs'
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
  process.chdir('../cli')
  const project = new Project()

  it('should get input types', () => {
    const sourceFile = project.createSourceFile('temp/exampleUseCase.ts', readFileSync(join(__dirname, 'exampleUseCase.ts')).toString())
    const { variableDeclaration } = getUseCaseVariableDefinition(sourceFile)
    const inputs = getUseCaseElements(variableDeclaration!, sourceFile)
    expect(inputs).to.be.an('object')
    expect(inputs.returns).to.eq('boolean')
    expect(inputs.inputs).to.deep.eq([{ name: 'id', type: 'string' }])
    expect(inputs.context).to.deep.eq([{ name: 'auth', type: '{ id: string; }' }])
  })
})
