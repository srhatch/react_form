import styles from './RadioInput.module.scss';
import { RadioInputProps } from '../../interfaces';
import { useContext, useState } from 'react'
import { FormContext } from '../form_context/page';

export default function RadioInput({ componentName, inputFor, items, errorFor }: RadioInputProps) {
    const [isSelected, setIsSelected] = useState<string>('');
    const { getValue, setValue } = useContext(FormContext);

    // TODO: add label
    return (
        <div className={errorFor ? [styles.radioContainer, styles.radioContainer_error, `${componentName}-radioContainer`].join(' ') : [styles.radioContainer, `${componentName}-radioContainer`].join(' ')}>
            <fieldset>
                {
                    items?.map((item) => {
                        return (
                            <button
                                key={item}
                                className={isSelected === item ? [styles.radioLabel, styles.selected].join(' ') : styles.radioLabel}
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
