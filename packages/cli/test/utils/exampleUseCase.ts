import { UseCase } from '@userstorybook/core'

export const exampleUseCase: UseCase<{ id: string }, { auth: { id: string } }, boolean> = function ({ id }, { auth }) {
  return id === auth.id
}
