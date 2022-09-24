import { UseCase } from '@userstorybook/core'
import { ReturnType, DefaultContext } from './exampleTypes'

export const exampleUseCase3: UseCase<{ id: string }, DefaultContext, Promise<ReturnType>> = function ({ id }, { auth }) {
  return Promise.resolve(id === auth.id)
}

export type UseCase3 = typeof exampleUseCase3