import styles from './DropdownFieldset.module.scss';
import { DropdownFieldsetProps } from '@/types/interfaces';
import { useState, useRef, useContext, useCallback, useEffect } from 'react';
import { FormContext } from '../form_context/page';
import useManageListeners from '@/app/manage_listeners';

export default function DropdownFieldset({ componentName, inputFor, buttonText, items }: DropdownFieldsetProps) {
    const [isListHidden, setIsListHidden] = useState(true);
    const menuButtonRef = useRef<HTMLButtonElement>(null); // Mainly used for focusing
    const itemListRef = useRef<HTMLUListElement>(null); // DOM entry point for navigating the list of items
    const listIndex = useRef(-1); // Keep track of which li has focus
    const { getValue, setValue, getError } = useContext(FormContext);
    const value = getValue(inputFor);
    const errorObj = getError(value?.errors);
    const [addListeners, removeListeners] = useManageListeners();

    const cachedClickCloseEvent = useCallback(
        (e: Event): void => {
            if (!itemListRef.current) {
                // Removes listeners if page is navigated away
                removeListeners(['cachedClickCloseEvent', 'cachedEscCloseList']);
            } else if (!itemListRef.current?.contains(e.target as Node) && !menuButtonRef.current?.contains(e.target as Node)) { 
                // Close the menu if user clicks outside
                setIsListHidden(true);
                removeListeners(['cachedClickCloseEvent', 'cachedEscCloseList']);
            }
        }, [itemListRef, setIsListHidden])

    const cachedEscCloseList = useCallback(
        (e: Event) => {
            if (!itemListRef.current) {
                // Removes listeners if page is navigated away
                removeListeners(['cachedClickCloseEvent', 'cachedEscCloseList']);
            } else if ((e as KeyboardEvent).key === 'Escape') {
                // Close menu if Escape key is pressed
                setIsListHidden(true);
                removeListeners(['cachedClickCloseEvent', 'cachedEscCloseList']);
            }
        }, [itemListRef, setIsListHidden])

        useEffect(() => {
            if (!isListHidden) {
                // Add closing listeners if menu is open
                addListeners([
                    {name: 'cachedClickCloseEvent', eventType: 'click', callback: cachedClickCloseEvent, useCapture: false},
                    {name: 'cachedEscCloseList', eventType: 'keydown', callback: cachedEscCloseList, useCapture: false}
                ])
            }
        }, [isListHidden, cachedClickCloseEvent, cachedEscCloseList])

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
                <input
                    type='hidden'
                    name={inputFor}
                    value={value?.value ?? ''}
                    aria-required='true'
                    aria-invalid={errorObj?.isError ? 'true' : 'false'}
                    aria-errormessage={errorObj?.isError ? `${inputFor}-errorMsg-id` : ''}
                />
                <button
                    ref={menuButtonRef}
                    type='button'
                    className={ errorObj?.isError ? [styles.openMenuButton, 'errorOutline'].join(' ') : styles.openMenuButton}
                    onKeyDown={(e) => {
                        handleArrowNav(e);
                        handleTabNav(e);
                    }}
                    onClick={handleMenuClick}
                    aria-expanded={isListHidden ? 'false' : 'true'}
                    aria-controls='dropdown-ul'
                    aria-label={buttonText}
                >{value?.value || buttonText}</button>
                {
                    !isListHidden &&
                    <ul
                        id='dropdown-ul'
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
            {errorObj?.isError && <div id={`${inputFor}-errorMsg-id`} className={styles.errorMsg}>{errorObj?.errorMsg}</div>}
        </div>
    )
}
