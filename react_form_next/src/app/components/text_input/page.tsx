import styles from './TextInput.module.scss'; // For text input styles
import { useContext } from 'react';
import { TextInputProps } from '../../../types/interfaces';
import { FormContext } from '../form_context/page';

export default function TextInput({ componentName, inputFor, labelText, inputMode, isPassword}: TextInputProps) {
    const { getValue, setValue, getError } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = getError(value?.errors);
    const baseIdentity = `${componentName}_${inputFor}`;
    const inputClass = generateInputClass(baseIdentity, errorObj?.isError);
    const labelClass = generateLabelClass(baseIdentity);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValue(inputFor, e.target.value);
    }

    return (
        <div className={[styles.textInputContainer, `${baseIdentity}InputContainer`].join(' ')}>
            <label
                htmlFor={`${baseIdentity}Id`}
                className={labelClass}
            >{labelText}</label>
            <input
                id={`${baseIdentity}Id`}
                className={inputClass}
                name={inputFor}
                value={value?.value ?? ''}
                inputMode={inputMode}
                type={isPassword ? 'password' : 'text'}
                autoComplete={isPassword ? 'off' : 'on'}
                onChange={handleInputChange}
                aria-required='true'
                aria-invalid={errorObj?.isError ? 'true' : 'false'}
                aria-errormessage={errorObj?.isError ? `${inputFor}-errorMsg-id` : ''}
            ></input>
            {errorObj?.isError && <div id={`${inputFor}-errorMsg-id`} className={styles.textInputErrorMsg} role='alert'>{errorObj?.errorMsg}</div>}
        </div>        
    )
}

function generateInputClass(baseIdentity: string, isError: string | undefined) {
    const baseInputClass = 'textInput'; // Used for input component styling
    const componentSpecificClass = `${baseIdentity}Input`; // Used for global styling (mainly positioning on page)
    const classArray = [styles[baseInputClass], componentSpecificClass];
    if (isError) classArray.push('errorOutline'); // Error styling
    return classArray.join(' ');
}

function generateLabelClass(baseIdentity: string) {
    const baseClass = 'inputLabel'; // For input component styling
    const specificClass = `${baseIdentity}Label`; // Global styling (positioning on page)
    const classes = [styles[baseClass], specificClass].join(' ');
    return classes;
}
