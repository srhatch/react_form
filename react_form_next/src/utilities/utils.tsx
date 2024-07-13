import { FormInputValues } from '../types/interfaces';
import RegisterModel from '../class_defs/register_model';

export function processSubmit(inputValues: FormInputValues) {
    // This needs to return a boolean indicating whether there are validation
    // errors as well as the model instance with values in the proper format to elaborate on errors {value: string, errors: ErrorObject[]}
    const registerInstance = new RegisterModel(inputValues);
    const errors = registerInstance.checkErrors();
    return [errors, registerInstance];
}