import styles from './DateInput.module.scss';
import { DateInputProps } from '../../interfaces';
import { useState, useContext } from 'react';
import { FormContext } from '../form_context/page';

export default function DateInput({ componentName, inputFor, labelText, errorFor }: DateInputProps) {
    const [keyValue, setKeyValue] = useState('');
    const { getValue, setValue } = useContext(FormContext);

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
            >{labelText}{errorFor ? ' *' : ''}</label>
            <input
                id={`${componentName}-${inputFor}Id`}
                className={errorFor ? [styles.dateInput, styles.dateInput_error].join(' ') : styles.dateInput}
                type='text'
                inputMode='numeric'
                name={inputFor}
                value={getValue(inputFor)}
                maxLength={12}
                onKeyDown={handleGetKey}
                onChange={handleUserInput}
            />
        </div>

    )
}