import styles from './DateSelector.module.scss';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker';
import { useContext } from 'react';
import { FormContext } from '../form_context/page';
import { DateSelectorProps } from '../../../types/interfaces';

export default function DateSelector({ children, componentName, inputFor, labelText }: DateSelectorProps) {
    const { getValue, setValue, getError } = useContext(FormContext);
    const valueObj = getValue(inputFor);
    const errorObj = getError(valueObj?.errors);

    return (
        <div className={[styles.dateSelectorContainer, `${componentName}-dateSelectorContainer`].join(' ')}>
            <label
                htmlFor={`${componentName}-${inputFor}Id`}
                className={styles.dateSelectorLabel}
            >{labelText}{errorObj?.isError ? ' *' : ''}{children}</label>
            <DatePicker
                id={`${componentName}-${inputFor}Id`}
                className={errorObj?.isError ? [styles.dateSelectorInput, 'errorOutline'].join(' ') : styles.dateSelectorInput}
                name={inputFor}
                selected={valueObj?.value ?? ''}
                onChange={(value: Date | null) => setValue(inputFor, value)}
                ariaRequired='true'
                ariaInvalid={errorObj?.isError ? 'true' : 'false'}
            />
        </div>
    )
}
