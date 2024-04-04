import styles from './RadioInput.module.scss';
import { RadioInputProps } from '../../interfaces';
import { useContext, useState } from 'react'
import { FormContext } from '../form_context/page';

export default function RadioInput({ componentName, inputFor, labelText, items, errorFor }: RadioInputProps) {
    const [isSelected, setIsSelected] = useState<string>('');
    const { getValue, setValue } = useContext(FormContext);

    return (
        <div className={errorFor ? [styles.radioContainer, styles.radioContainer_error, `${componentName}-radioContainer`].join(' ') : [styles.radioContainer, `${componentName}-radioContainer`].join(' ')}>
            <fieldset>
                <label className={styles.radioLabel} htmlFor={`${inputFor}-hiddenInput`}>
                    {labelText}{errorFor ? ' *' : ''}
                </label>
                {
                    items?.map((item) => {
                        return (
                            <button
                                key={item}
                                className={isSelected === item ? [styles.radioButton, styles.selected].join(' ') : styles.radioButton}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setValue(inputFor, item);
                                    setIsSelected(item);
                                }}
                            >{item.replace(item[0], item[0].toUpperCase())}
                        </button>
                        )
                    })
                }
                <input
                    id={`${inputFor}-hiddenInput`}
                    type="hidden"
                    name={inputFor}
                    value={getValue(inputFor)}
                />
            </fieldset>
        </div>
    )
}
