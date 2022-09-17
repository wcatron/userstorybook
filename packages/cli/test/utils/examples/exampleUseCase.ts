import { UseCase } from '@userstorybook/core'
import { ReturnType, AuthContext } from './exampleTypes'

export const exampleUseCase: UseCase<{ id: string }, { auth: AuthContext }, ReturnType> = function ({ id }, { auth }) {
  return id === auth.id
}
