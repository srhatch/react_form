import styles from './DropdownFieldset.module.scss';
import { DropdownFieldsetProps } from '../../../types/interfaces';
import { useState, useRef, useContext, useCallback, useEffect } from 'react';
import { FormContext } from '../form_context/page';

export default function DropdownFieldset({ componentName, inputFor, buttonText, items }: DropdownFieldsetProps) {
    const [isListHidden, setIsListHidden] = useState(true);
    const menuButtonRef = useRef<HTMLButtonElement>(null); // Mainly used for focusing
    const itemListRef = useRef<HTMLUListElement>(null); // DOM entry point for navigating the list of items
    const listIndex = useRef(-1); // Keep track of which li has focus
    const { getValue, setValue, getError } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = getError(value?.errors);

    const cachedClickCloseEvent = useCallback(
        (e: MouseEvent): void => {
            // Close the menu if user clicks outside
            if (!itemListRef.current?.contains(e.target as Node) && !menuButtonRef.current?.contains(e.target as Node)) { 
                    setIsListHidden(true);
                    document.removeEventListener('click', cachedClickCloseEvent)
            }
        }, [itemListRef, setIsListHidden])

    const cachedEscCloseList = useCallback(
        (e: KeyboardEvent) => {
            // Close menu if Escape key is pressed
            if (itemListRef.current) {
                if (e.key === 'Escape') {
                    setIsListHidden(true);
                    document.removeEventListener('keydown', cachedEscCloseList);
                }
            } else {
                document.removeEventListener('keydown', cachedEscCloseList);
            }
        }, [itemListRef, setIsListHidden])

        useEffect(() => {
            if (!isListHidden) {
                // Add closing listeners if menu is open
                document.addEventListener('click', cachedClickCloseEvent);
                document.addEventListener('keydown', cachedEscCloseList);
            }
        }, [isListHidden])

    function handleMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
            setIsListHidden(v => !v);
            menuButtonRef.current?.focus(); // Default browser behavior drops focus on button clicks
    }

    function handleItemSelect(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        setValue(inputFor, (e.target as HTMLButtonElement).value);
        (menuButtonRef.current as HTMLButtonElement).focus();
        setIsListHidden(true);
    }

    function handleArrowNav(e: React.KeyboardEvent<HTMLButtonElement>) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (listIndex.current > 0 ) {
                // navigate list using listIndex
                listIndex.current--;
                (itemListRef.current?.children[listIndex.current]?.firstElementChild as HTMLElement).focus();
            } else if (listIndex.current === 0) {
                menuButtonRef.current?.focus();
                listIndex.current = -1;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (listIndex.current < items?.length - 1) {
                // if list is open track navigation with listIndex
                listIndex.current++;
                (itemListRef.current?.children[listIndex.current]?.firstElementChild as HTMLElement).focus();
            } else if (listIndex.current === items?.length - 1) {
                listIndex.current = 0;
                (itemListRef.current?.children[listIndex.current]?.firstElementChild as HTMLElement).focus();
            }
        }
    }

    function handleTabNav(e: React.KeyboardEvent<HTMLButtonElement>) {
        // Tab navigation will put focus on previous or next element, so close the list if it's open
        if ((e.shiftKey && e.key === 'Tab') || e.key === 'Tab') {
            if (listIndex.current > -1) listIndex.current = -1;
            if (!isListHidden) setIsListHidden(true);
        }
    }

    return (
        <div className={[styles.fieldsetContainer, `${componentName}-fieldsetContainer`].join(' ')}>
            <fieldset>
                <input type='hidden' name={inputFor} value={value?.value ?? ''} />
                <button
                    ref={menuButtonRef}
                    type='button'
                    className={ errorObj?.isError ? [styles.openMenuButton, 'errorOutline'].join(' ') : styles.openMenuButton}
                    onKeyDown={(e) => {
                        handleArrowNav(e);
                        handleTabNav(e);
                    }}
                    onClick={handleMenuClick}
                >{value?.value || buttonText}{errorObj?.isError ? ' *' : ''}</button>
                {
                    !isListHidden &&
                    <ul
                        ref={itemListRef}
                        className={styles.itemList}
                        role='listbox'
                    >
                        {items.map(item => {
                            return (
                                <li key={item}>
                                    <button
                                        className={styles.itemButton}
                                        value={item}
                                        onClick={handleItemSelect}
                                        onKeyDown={(e) => {
                                            handleArrowNav(e);
                                            handleTabNav(e);
                                        }}
                                    >{item}</button>
                                </li>
                            )
                        })}
                    </ul>
                }
            </fieldset>
            {errorObj?.isError && <div className='errorMsg'>{errorObj?.errorMsg}</div>}
        </div>
    )
}
