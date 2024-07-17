import styles from './RadioInput.module.scss';
import { RadioInputProps } from '../../../types/interfaces';
import { useContext, useState } from 'react'
import { FormContext } from '../form_context/page';

export default function RadioInput({ componentName, inputFor, labelText, items }: RadioInputProps) {
    const [isSelected, setIsSelected] = useState<string>(''); // Determines CSS styling
    const { getValue, setValue, getError } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = getError(value?.errors);

    function handleRadioClick(e: React.MouseEvent<HTMLButtonElement>, item: string) {
        e.preventDefault();
        setValue(inputFor, item);
        setIsSelected(item);
    }

    return (
        <div className={[styles.radioContainer, `${componentName}-radioContainer`].join(' ')}>
            <fieldset className={errorObj?.isError ? [styles.buttonContainer, 'errorOutline'].join(' ') : styles.buttonContainer}>
                <label className={styles.radioLabel} htmlFor={`${inputFor}-hiddenInput`}>
                    {labelText}
                </label>
                {
                    items?.map((item) => {
                        return (
                            <button
                                type='button'
                                key={item}
                                className={isSelected === item ? [styles.radioButton, styles.selected].join(' ') : styles.radioButton}
                                onClick={(e) => {handleRadioClick(e, item)}}
                            >{item.replace(item[0], item[0].toUpperCase())}</button>
                        )
                    })
                }
                <input
                    id={`${inputFor}-hiddenInput`}
                    type="hidden"
                    name={inputFor}
                    value={value?.value ?? ''}
                    aria-required='true'
                    aria-invalid={errorObj?.isError ? 'true' : 'false'}
                    aria-errormessage={errorObj?.isError ? `${inputFor}-errorMsg-id` : ''}
                />
            </fieldset>
            {errorObj?.isError && <div id={`${inputFor}-errorMsg-id`} className={styles.radioErrorMsg} role='alert'>{errorObj?.errorMsg}</div>}
        </div>
    )
}
