import styles from './DateInput.module.scss';
import { DateInputProps } from '../../types/interfaces';
import { useState, useContext } from 'react';
import { FormContext } from '../form_context/page';

export default function DateInput({ componentName, inputFor, labelText, dateFormat }: DateInputProps) {
    const [keyValue, setKeyValue] = useState('');
    const { getValue, setValue, getError } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = getError(value?.errors);

    function handleGetKey(e: React.KeyboardEvent<HTMLInputElement>) {
        // Gets the key string for handleUserInput (which is an onChange handler)
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
            // Deletes the slash automatically if deleting starts from from a '/'
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
            >{labelText}{errorObj?.isError ? ' *' : ''}</label>
            <input
                id={`${componentName}-${inputFor}Id`}
                className={errorObj?.isError ? [styles.dateInput, 'errorOutline'].join(' ') : styles.dateInput}
                type='text'
                inputMode='numeric'
                name={inputFor}
                value={value?.value ?? ''}
                maxLength={12}
                placeholder={dateFormat}
                onKeyDown={handleGetKey}
                onChange={handleUserInput}
            />
            {errorObj?.isError && <div className={styles.dateErrorMsg}>{ errorObj?.errorMsg }</div>}
        </div>
    )
}