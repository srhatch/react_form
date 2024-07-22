import styles from './DateInput.module.scss';
import { DateInputProps } from '../../../types/interfaces';
import { useContext } from 'react';
import { FormContext } from '../form_context/page';

export default function DateInput({ componentName, inputFor, labelText, dateFormat }: DateInputProps) {
    const { getValue, setValue, getError } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = getError(value?.errors);

    function handleUserInput(e: React.UIEvent<HTMLInputElement, InputEvent>) {
        // Automatically inserts or deletes forward slashes as the user types
        let inputValue = (e.target as HTMLInputElement).value;
        switch(e.nativeEvent.inputType) {
            case 'insertText': {
                if (/[0-9]/.test(inputValue[inputValue.length - 1])) {
                    // Prevent letter keys from being entered
                    if (inputValue.length === 2 || inputValue.length === 5) {
                        // Automatically add a '/'
                        setValue(inputFor, (inputValue + '/'));
                    } else if (inputValue.length > 10) {
                        e.preventDefault(); // Maximum length reached, prevent any further keypresses
                    } else {
                        setValue(inputFor, inputValue);
                    }
                }
                break;
            }
            case 'deleteContentBackward': {
                // Deletes the slash automatically if deleting starts from from a '/'
                if (inputValue.length === 5 || inputValue.length === 2) {
                    setValue(inputFor, (inputValue.substring(0, inputValue.length - 1)));
                } else {
                    setValue(inputFor, inputValue);
                }
                break;
            }
            case 'insertFromPaste': {
                // Handles copy pasting
                setValue(inputFor, inputValue);
                break;
            }
        }
    }

    return (
        <div className={[styles.dateInputContainer, `${componentName}-dateInputContainer`].join(' ')}>
            <label
                htmlFor={`${componentName}-${inputFor}Id`}
                className={styles.dateLabel}
            >{labelText}</label>
            <input
                id={`${componentName}-${inputFor}Id`}
                className={errorObj?.isError ? [styles.dateInput, 'errorOutline'].join(' ') : styles.dateInput}
                type='text'
                inputMode='numeric'
                autoComplete='on'
                name={inputFor}
                value={value?.value ?? ''}
                maxLength={12}
                placeholder={dateFormat}
                onInput={handleUserInput}
                aria-required='true'
                aria-invalid={errorObj?.isError ? 'true' : 'false'}
                aria-errormessage={errorObj?.isError ? `${inputFor}-errorMsg-id` : ''}
            />
            {errorObj?.isError && <div id={`${inputFor}-errorMsg-id`} className={styles.dateErrorMsg}>{ errorObj?.errorMsg }</div>}
        </div>
    )
}