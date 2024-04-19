'use client';
import styles from './FormContext.module.scss';
import { createContext, useReducer, useCallback } from 'react';
import { ValidatingFormProps, ErrorObject } from '../../../types/interfaces';
import FormContextReducer from '../../../reducers/form_reducer';

export const FormContext = createContext(Object.create({}));

export default function ValidatingFormContext({ children, processSubmit, fetchFunction }: ValidatingFormProps) {
    // Provides setter and getter functions to its children to update the inputValues object
    // Wrap form inputs in this component
    const [inputValues, dispatch] = useReducer(FormContextReducer, {});

    const getValue = useCallback((name: string) => inputValues[name], [inputValues]);

    const getError = useCallback((errors: ErrorObject[]) => {
        // Returns the first error (if there is one) from the error array for a given property
        if (errors?.length > 0) {
            return errors[0]
        } else {
            return undefined;
        }
    }, [])

    function checkAnyErrors() {
        // To display error message
        for (let prop in inputValues) {
            if (prop && inputValues[prop].errors.length > 0) {
                return true;
            }
        }
    }

    function handleRegisterSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const [errors, values] = processSubmit(inputValues);
        if (errors) {
            dispatch({type: 'setValues', payload: values});
        } else {
          // Fetch to API endpoint: fetchFunction(values);
        }
    }

    const formMethods = {
        getValue: getValue,
        dispatch: dispatch,
        getError: getError
    };

    return (
        <FormContext.Provider value={formMethods}>
            <form className={styles.form} onSubmit={handleRegisterSubmit}>
                {children}
                <input type='submit' className={styles.submitButton} value='Register' />
                {checkAnyErrors() && <div className='register-missingPrompt'>* Please fix any errors</div>}
            </form>
        </FormContext.Provider>
    )
}