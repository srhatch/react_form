'use client';
import { createContext, useState, useEffect, useCallback } from 'react';
import { ValidatingFormProps, InputValues } from '../../interfaces';
import { inputValuesInit } from '../page';

export const FormContext = createContext(Object.create({}));

export default function ValidatingForm({ children, setParentValues, initValues }: ValidatingFormProps) {
    // Takes in a setState function to pass values to its parent
    // Provides setter and getter functions to its children to updated the inputValues object
    // Wrap inputs in this form
    const [inputValues, setInputValues] = useState<InputValues>(initValues ?? inputValuesInit);

    useEffect(() => {
      // Send inputObject to this components parent e.g. to send in fetch request
        if (setParentValues) setParentValues({...inputValues});
    }, [inputValues])

    const setValue = useCallback(
        (name: string, value: string) => setInputValues(
            (inputObj) => ({...inputObj, [name]: value})
        ), [setInputValues]
    );

    const getValue = useCallback((name: string) => inputValues[name], [inputValues]);

    const deleteValue = useCallback(
        (name: string) => {
            setInputValues((v) =>{
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

    return (
        <FormContext.Provider value={formMethods}>
            {children}
        </FormContext.Provider>
    )
}