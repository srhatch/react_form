'use client';
import styles from './FormContext.module.scss';
import { createContext, useState, useCallback, useRef } from 'react';
import { ValidatingFormProps, ErrorObject, FormInputValues } from '../../../types/interfaces';
import { checkErrors } from '../../../utilities/utils';

export const FormContext = createContext(Object.create({}));

export default function ValidatingFormContext({ children, processSubmit, submitButtonValue, fetchFunction }: ValidatingFormProps) {
    // Provides setter and getter functions to its children to update the inputValues object
    // Wrap form inputs in this component
    const [inputValues, setInputValues] = useState<FormInputValues>({});
    const dialogRef = useRef(null);

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
    );

    const getError = useCallback((errors: ErrorObject[]) => {
        // Returns the first error (if there is one) from the error array for a given property
        if (errors?.length > 0) {
            return errors[0]
        } else {
            return undefined;
        }
    }, []);

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
            if (dialogRef.current) {
                (dialogRef.current as HTMLDialogElement).show();
                setTimeout(() => {
                    dialogRef.current && (dialogRef.current as HTMLDialogElement).close();
                }, 5000)
            }
          // Fetch to API endpoint: fetchFunction(values);
        }
    }

    return (
        <FormContext.Provider value={formMethods}>
            <h1 className={styles.formHeading}>Example form</h1>
            <form
                className={styles.form}
                onSubmit={handleRegisterSubmit}
            >
                {children}
                <input type='submit' className={styles.submitButton} value={submitButtonValue} />
                {checkErrors(inputValues) && <div className='missingPrompt'>Please fix any errors</div>}
                <dialog className={styles.successDialog} ref={dialogRef}>Form submitted successfully!</dialog>
            </form>
        </FormContext.Provider>
    )
}