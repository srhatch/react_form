import { FormInputValues, InputObject } from '../types/interfaces';
interface FormReducerAction {
    type: string;
    payload: InputObject[]
}

export default function FormContextReducer(state: FormInputValues, action: FormReducerAction): FormInputValues {
    switch(action.type) {
        case 'setValue':
            console.log(action.payload)
            // Clear error array when user types so UI error signaling disappears
            return {...state, [action.payload[0].name]: {value: action.payload[0].value, errors: []}}
        case 'setValues':
            const returnObj: FormInputValues = Object.create({});
            for (let item in action.payload) {
                returnObj[item] = action.payload[item];
            }
            return {...state, ...returnObj};
        case 'deleteValue':
            delete state[action.payload[0].name];
            return {...state};
        default:
            return {...state};
    }
}