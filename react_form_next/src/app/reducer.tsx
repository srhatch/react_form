import { ErrorObject, ActionObject } from '../interfaces';

export default function errorReducer(state: ErrorObject, action: ActionObject): ErrorObject {
    switch(action.type) {
        case 'setError':
            if (typeof action.payload === 'object') return {...action.payload};
        case 'clearError':
            if (typeof action.payload === 'string') {
                state[action.payload] = false;
                return {...state};
            }
        default:
            return state;
    }
}
