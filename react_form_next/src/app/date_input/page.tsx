import styles from './DateInput.module.scss';
import { DateInputProps } from '../../types/interfaces';
import { useState, useContext } from 'react';
import { FormContext } from '../form_context/page';
import { RegisterModel } from '../form_context/register_model';

export default function DateInput({ componentName, inputFor, labelText }: DateInputProps) {
    const [keyValue, setKeyValue] = useState('');
    const { getValue, setValue } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = RegisterModel.checkError(value?.errors);

    function handleGetKey(e: React.KeyboardEvent<HTMLInputElement>) {
        // Gets the key string so the handleUserInput handler can
        // use logic to prevent letter keys from being entered
        // and allowing the input to be deleted with backspace
        setKeyValue(e.key);
    }

    function handleUserInput(e: React.ChangeEvent) {
        // Automatically inserts or deletes forward slashes as the user types
        let inputValue = (e.target as HTMLInputElement).value;
        if (/[0-9]/.test(keyValue)) {
            // Runs if any number key is pressed
            if (inputValue.length === 2 || inputValue.length === 5) {
                // Automatically add a /
                setValue(inputFor, (inputValue + '/'));
            } else if (inputValue.length > 10) {
                e.preventDefault(); // Maximum length reached, prevent any further keypresses
            } else {
                setValue(inputFor, inputValue);
            }
        } else if (keyValue === 'Backspace') {
            // Deletes the slash automatically if deleting starts from
            // from the slash
            if (inputValue.length === 5 || inputValue.length === 2) {
                setValue(inputFor, (inputValue.substring(0, inputValue.length - 1)));
            } else {
                setValue(inputFor, inputValue);
            }
        }
    }

    return (
        <div className={[styles.dateInputContainer, `${componentName}-dateInputContainer`].join(' ')}>
            <label
                htmlFor={`${componentName}-${inputFor}Id`}
                className={styles.dateLabel}
            >{labelText}{errorObj ? ' *' : ''}</label>
            <input
                id={`${componentName}-${inputFor}Id`}
                className={errorObj ? [styles.dateInput, 'errorOutline'].join(' ') : styles.dateInput}
                type='text'
                inputMode='numeric'
                name={inputFor}
                value={value?.value ?? ''}
                maxLength={12}
                onKeyDown={handleGetKey}
                onChange={handleUserInput}
            />
            {errorObj && <div className={styles.dateErrorMsg}>{ errorObj?.errorMsg }</div>}
        </div>
    )
}