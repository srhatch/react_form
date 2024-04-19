'use client';
import styles from './FormContext.module.scss';
import { createContext, useState, useCallback } from 'react';
import { ValidatingFormProps, ErrorObject, FormInputValues } from '../../../types/interfaces';

export const FormContext = createContext(Object.create({}));

export default function ValidatingFormContext({ children, processSubmit, fetchFunction }: ValidatingFormProps) {
    // Provides setter and getter functions to its children to update the inputValues object
    // Wrap form inputs in this component
    const [inputValues, setInputValues] = useState<FormInputValues>({});

    const setValue = useCallback(
        // Clear error array when user types so UI error signaling disappears
        (name: string, value: string) => setInputValues(
            (inputObj: FormInputValues) => ({...inputObj, [name]: {value: value, errors: []}})
        ), [setInputValues]
    );

    const getValue = useCallback((name: string) => inputValues[name], [inputValues]);

    const deleteValue = useCallback(
        (name: string) => {
            setInputValues((inputObj: FormInputValues) =>{
                delete inputObj[name];
                return {...inputObj};
            })
        }, [setInputValues]
    )

    const getError = useCallback((errors: ErrorObject[]) => {
        // Returns the first error (if there is one) from the error array for a given property
        if (errors?.length > 0) {
            return errors[0]
        } else {
            return undefined;
        }
    }, [])

    const formMethods = {
        getValue: getValue,
        setValue: setValue,
        deleteValue: deleteValue,
        getError: getError
    };

    function handleRegisterSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const [errors, values] = processSubmit(inputValues);
        if (errors) {
            setInputValues(values);
        } else {
          // Fetch to API endpoint: fetchFunction(values);
        }
    }

    function checkAnyErrors() {
        // To display error message
        for (let prop in inputValues) {
            if (prop && inputValues[prop].errors.length > 0) {
                return true;
            }
        }
    }

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