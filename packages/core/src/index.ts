export type UseCase<InputT, ContextT, OuputT> = (
  input: InputT,
  context: ContextT
) => OuputT;
