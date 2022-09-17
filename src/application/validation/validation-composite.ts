export interface Validator {
  validate: () => Error | undefined;
}

export class ValidationComposite implements Validator {
  constructor(private readonly validators: Validator[]) {}

  validate(): Error | undefined {
    for (const validator of this.validators) {
      const error = validator.validate();
      if (error) {
        return error;
      }
    }
  }
}
