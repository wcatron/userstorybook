import { UseCase } from '@userstorybook/core'
import { ReturnType, DefaultContext } from './exampleTypes'

export const exampleUseCase2: UseCase<{ id: string }, DefaultContext, ReturnType> = function ({ id }, { auth }) {
  return id === auth.id
}
