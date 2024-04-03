import styles from './TextInput.module.scss'; // For text input styles
import { useContext } from 'react';
import { TextInputProps } from '../../interfaces';
import { FormContext } from '../form_context/page';

export default function TextInput({ componentName, inputFor, inputMode, isPassword, errorFor }: TextInputProps) {
    const baseIdentity = `${componentName}_${inputFor}`;
    const inputClass = generateInputClass(baseIdentity, errorFor);
    const labelText = generateLabelText(inputFor, errorFor);
    const labelClass = generateLabelClass(baseIdentity);

    const { getValue, setValue } = useContext(FormContext);

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
                value={getValue(inputFor)}
                inputMode={inputMode}
                type={isPassword ? 'password' : 'text'}
                onChange={handleInputChange}
            ></input>
            {!!errorFor && <div className={styles.textInputErrorMsg}>{generateErrorText(errorFor)}</div>}
        </div>        
    )
}

function generateInputClass(baseIdentity: string, errorFor: string) {
    const baseInputClass = 'textInput'; // Used for input component styling
    const componentSpecificClass = `${baseIdentity}Input`; // Used for global styling (mainly positioning on page)
    const classArray = [styles[baseInputClass], componentSpecificClass];
    if (errorFor) classArray.push(styles.textInput_error); // Error styling
    return classArray.join(' ');
}

function generateLabelText(inputFor: string, errorFor: string) {
    let labelText;
    switch(inputFor) {
        case 'username':
            labelText = 'Username';
            break;
        case 'email':
            labelText = 'Email';
            break;
        case 'password':
            labelText = 'Password';
            break;
        case 'passwordConfirm':
            labelText = 'Confirm password';
            break;
        case 'place':
            labelText = 'City/town';
            break;
    }
    if (errorFor) labelText + ' *'; // Provides a non-color visual to indicate an error
    return labelText;
}

function generateLabelClass(baseIdentity: string) {
    const baseClass = 'inputLabel'; // For input component styling
    const specificClass = `${baseIdentity}Label`; // Global styling (positioning on page)
    const classes = [styles[baseClass], specificClass].join(' ');
    return classes;
}

function generateErrorText(errorFor:string) {
    switch(errorFor) {
        case 'usernameFormatError':
            return 'Username cannot end with ".com"';
        case 'emailFormatError':
            return 'Email must be in correct format';
        case 'passwordMatchError':
            return 'Passwords must match';
    }
}
