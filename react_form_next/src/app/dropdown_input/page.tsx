import styles from './DropdownInput.module.scss';
import { DropdownInputProps } from '../../interfaces';
import { useState, useRef, useContext, useCallback, useEffect } from 'react';
import { FormContext } from '../form_context/page';

export default function DropdownInput({ componentName, inputFor, items, errorFor, labelText }: DropdownInputProps) {
    const [isListHidden, setIsListHidden] = useState(true);
    const [itemList, setItemList] = useState<string[]>([]); // For filtering (and displaying) list items
    const itemListRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null); // Used to put back focus on input element
    const listIndex = useRef(-1); // For applying CSS styling to highlight the current focues (button) element
    
    const { getValue, setValue } = useContext(FormContext);
    const value = getValue(inputFor);

    const cachedClickCloseItemList = useCallback((e: MouseEvent): void => {
        // To make the menu close by clicking outside its area
        if (itemListRef.current?.contains(e.target as Node)) {
                setIsListHidden(true);
        }
    }, [itemListRef, setIsListHidden])

    const cachedEscCloseItemList = useCallback(
        // To make the menu close with Escape key
        (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                setIsListHidden(true);
                document.removeEventListener('keydown', cachedEscCloseItemList);
            }
        }, [itemListRef, setIsListHidden])

    useEffect(() => {
        if (!isListHidden) {
            document.addEventListener('click', cachedClickCloseItemList, {once: true});
            document.addEventListener('keydown', cachedEscCloseItemList);
        }
    }, [isListHidden])

    function handleUserInput(e: React.ChangeEvent<HTMLInputElement>) {
        e.target.value.length > 0 ? setIsListHidden(false) : setIsListHidden(true); // Display the list if the user types anything
        listIndex.current = -1; // Reset the index used for keyboard navigation
        setValue('state', e.target.value); // Display what the user types real-time

        // Filter the list based on what the user has typed and store it in state
        let filteredList = items.filter(item => item.toLowerCase().startsWith(e.target.value.toLowerCase()));
        setItemList(filteredList);
    }

    function handleItemSelection(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        setValue(inputFor, (e.target as HTMLButtonElement).value);
        inputRef.current?.focus();// remove this?
        setIsListHidden(true);
        listIndex.current = -1; // Reset so when the user starts deleting text the old index won't cause that <li> to highlight
    }

    function handleReopenList(e: React.MouseEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) {
        e.stopPropagation(); // Stop event from triggering close menu event handler
        if (value?.length > 0) {
            // Only open if text is present
            setIsListHidden(false);
        }
    }

    function handleArrowNav(e: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>) {
        // preventDefault() is needed because the list may have a scrollbar and default
        // behavior for arrow keys is to scroll
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (listIndex.current > 0 ) {
                // navigate list using listIndex
                listIndex.current--;
                (itemListRef.current?.children[listIndex.current]?.children[0] as HTMLElement).focus();
            } else if (listIndex.current === 0) {
                // Returns focus to the input element
                inputRef.current?.focus();
                listIndex.current = -1;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (listIndex.current < itemList?.length - 1) {
                // if list is open track navigation with listIndex
                listIndex.current++;
                (itemListRef.current?.children[listIndex.current]?.children[0] as HTMLElement).focus();
            }
        }
    }

    function handleTabNav(e: React.KeyboardEvent<HTMLInputElement>) {
        // Tab navigation will put focus on previous or next element, so close the list if it's open
        if ((e.shiftKey && e.key === 'Tab') || e.key === 'Tab') {
            if (!isListHidden) setIsListHidden(true);
        }
    }

    return (
        <div className={[`${componentName}_${inputFor}InputDiv`, styles.dropdownContainer].join(' ')}>
            <label htmlFor={`${inputFor}Input-id`} className={styles.stateLabel}>
                {labelText}{errorFor ? ' *' : ''}
            </label>
            <input
                ref={inputRef}
                id={`${inputFor}Input-id`}
                type="text"
                className={errorFor ? [styles.dropdownInput, styles.textInput_error].join(' ') : styles.dropdownInput}
                name={inputFor}
                value={value}
                onChange={handleUserInput}
                onKeyDown={(e) => {
                    handleArrowNav(e);
                    handleTabNav(e);
                }}
                onFocus={handleReopenList}
            />
            <ul ref={itemListRef} className={styles.dropdownList} hidden={isListHidden}>
                {itemList?.map(item =>
                    <li key={item}>
                        <button
                            className={styles.itemButton}
                            onClick={handleItemSelection}
                            onKeyDown={handleArrowNav}
                            value={item}
                        >{item}</button>
                    </li>
                )}
            </ul>
            {errorFor && <span className={styles.incorrectInputErrorMsg}>placeholder</span>}
        </div>
    )
}
