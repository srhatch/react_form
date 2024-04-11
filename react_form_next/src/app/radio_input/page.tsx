import styles from './RadioInput.module.scss';
import { RadioInputProps } from '../../interfaces';
import { useContext, useState } from 'react'
import { FormContext } from '../form_context/page';
import { RegisterModel } from '../../class_defs';

export default function RadioInput({ componentName, inputFor, labelText, items }: RadioInputProps) {
    const [isSelected, setIsSelected] = useState<string>('');
    const { getValue, setValue } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = RegisterModel.checkError(value?.errors);

    function handleRadioClick(e: React.MouseEvent<HTMLButtonElement>, item: string) {
        e.preventDefault();
        setValue(inputFor, item);
        setIsSelected(item);
    }

    return (
        <div className={errorObj ? [styles.radioContainer, 'errorOutline', `${componentName}-radioContainer`].join(' ') : [styles.radioContainer, `${componentName}-radioContainer`].join(' ')}>
            <fieldset>
                <label className={styles.radioLabel} htmlFor={`${inputFor}-hiddenInput`}>
                    {labelText}{errorObj ? ' *' : ''}
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
                />
            </fieldset>
        </div>
    )
}
