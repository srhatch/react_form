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
        <div className={errorObj?.isError ? [styles.radioContainer, 'errorOutline', `${componentName}-radioContainer`].join(' ') : [styles.radioContainer, `${componentName}-radioContainer`].join(' ')}>
            <fieldset>
                <label className={styles.radioLabel} htmlFor={`${inputFor}-hiddenInput`}>
                    {labelText}{errorObj?.isError ? ' *' : ''}
                </label>
                {
                    items?.map((item) => {
                        return (
                            <button
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
                />
            </fieldset>
        </div>
    )
}
