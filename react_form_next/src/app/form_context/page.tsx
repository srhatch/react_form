'use client';
import styles from './FormContext.module.scss';
import { createContext, useState, useCallback } from 'react';
import { ValidatingFormProps } from '../../types/interfaces';
import { RegisterModel } from './register_model';

export const FormContext = createContext(Object.create({}));

export default function ValidatingFormContext({ children, fetchFunction }: ValidatingFormProps) {
    // Provides setter and getter functions to its children to update the inputValues object
    // Wrap inputs in this component
    const [inputValues, setInputValues] = useState<any>({});

    const setValue = useCallback(
        (name: string, value: string) => setInputValues(
            (inputObj: any) => ({...inputObj, [name]: {value: value, errors: []}})
        ), [setInputValues]
    );

    const getValue = useCallback((name: string) => inputValues[name], [inputValues]);

    const deleteValue = useCallback(
        (name: string) => {
            setInputValues((v:any) =>{
                delete v[name];
                return {...v};
            })
        }, [setInputValues]
    )

    const resetForm = useCallback(() => setInputValues(Object.create({})), [setInputValues]);

    const formMethods = {
        getValue: getValue,
        setValue: setValue,
        deleteValue: deleteValue,
        resetForm: resetForm
    };

    function handleRegisterSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        const registerInstance = new RegisterModel(inputValues);
        const errors = registerInstance.checkErrors(); // Passing states to check for incorrect dropdown input
        if (errors) {
            setInputValues(registerInstance);
        } else {
          // Fetch to API endpoint: fetchFunction(values);
        }
    }
    console.log(inputValues)
    // {Object.keys(inputValues).length > 0 && <div className='register-missingPrompt'>* Please fill in required fields</div>}
    return (
        <FormContext.Provider value={formMethods}>
            <form className={styles.registerForm} onSubmit={handleRegisterSubmit}>
                {children}
                <input type='submit' className={styles.submitButton} value='Register' />
            </form>
        </FormContext.Provider>
    )
}