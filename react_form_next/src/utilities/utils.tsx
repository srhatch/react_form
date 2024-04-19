import { FormInputValues } from '../types/interfaces';
import { RegisterModel } from '../class_defs/register_model';

export function processSubmit(inputValues: FormInputValues) {
    // This needs to return a boolean indicating whether there are validation errors and a values object in the proper format {value: string, errors: ErrorObject[]}
    const registerInstance = new RegisterModel(inputValues);
    const errors = registerInstance.checkErrors();
    return [errors, registerInstance];
  }