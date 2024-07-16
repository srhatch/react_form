import { FormInputValues } from '../types/interfaces';
import RegisterModel from '../class_defs/register_model';

export function processSubmit(inputValues: FormInputValues) {
    // This needs to return a boolean indicating whether there are validation
    // errors as well as the model instance with values in the proper format to elaborate on errors {value: string, errors: ErrorObject[]}
    const registerInstance = new RegisterModel(inputValues);
    const errors = registerInstance.validate();
    return [errors, registerInstance];
}

export function checkErrors(inputObj: FormInputValues) {
    // Checks for presence of error objects in the errors property of an input object
    for (let value of Object.values(inputObj)) {
        if (value.errors.length > 0) {
            return true;
        }
    }
    return false;
}