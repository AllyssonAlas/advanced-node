export interface Validator {
  validate: () => Error | undefined;
}

export class ValidationComposite {
  constructor(private readonly validators: Validator[]) {}

  validate(): undefined {
    return undefined;
  }
}
