import styles from './DropdownFieldset.module.scss';
import { DropdownFieldsetProps } from '../../interfaces';
import { useState, useRef, useContext, useCallback, useEffect } from 'react';
import { FormContext } from '../form_context/page';

export default function DropdownFieldset({ componentName, inputFor, buttonText, items, errorFor, errorMsg }: DropdownFieldsetProps) {
    const [isListHidden, setIsListHidden] = useState(true);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const itemListRef = useRef<HTMLUListElement>(null);
    const listIndex = useRef(-1);
    const { getValue, setValue } = useContext(FormContext);
    const value = getValue(inputFor);

    const cachedClickCloseEvent = useCallback(
        (e: MouseEvent): void => {
            if (!itemListRef.current?.contains(e.target as Node) && !menuButtonRef.current?.contains(e.target as Node)) { 
                    setIsListHidden(true);
                    document.removeEventListener('click', cachedClickCloseEvent)
            }
        }, [itemListRef, setIsListHidden])

    const cachedEscCloseList = useCallback(
        (e: KeyboardEvent) => {
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
        // event must be prevented from triggering the close filter menu event handler
        // the dropdown is relative so the contains() method won't register it as
        // a child element
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
                // Returns focus to the input element
                menuButtonRef.current?.focus();
                listIndex.current = -1;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (listIndex.current < items?.length - 1) {
                // if list is open track navigation with listIndex
                listIndex.current++;
                (itemListRef.current?.children[listIndex.current]?.firstElementChild as HTMLElement).focus();
            }
        }
    }

    function handleTabNav(e: React.KeyboardEvent<HTMLButtonElement>) {
        // Tab navigation will put focus on previous or next element, so close the list if it's open
        if ((e.shiftKey && e.key === 'Tab') || e.key === 'Tab') {
            if (!isListHidden) setIsListHidden(true);
        }
    }

    return (
        <div className={[styles.fieldsetContainer, `${componentName}-fieldsetContainer`].join(' ')}>
            <fieldset>
                <input type='hidden' name={inputFor} value={value} />
                <button
                    ref={menuButtonRef}
                    type='button'
                    className={ errorFor ? [styles.openMenuButton, styles.openMenuButton_error].join(' ') : styles.openMenuButton}
                    onKeyDown={(e) => {
                        handleArrowNav(e);
                        handleTabNav(e);
                    }}
                    onClick={handleMenuClick}
                >{value || buttonText}{errorFor ? ' *' : ''}</button>
                {
                    !isListHidden &&
                    <ul ref={itemListRef} className={styles.itemList}>
                        {items.map(item => {
                            return (
                                <li key={item}>
                                    <button
                                        className={styles.itemButton}
                                        value={item}
                                        onClick={handleItemSelect}
                                        onKeyDown={handleArrowNav}
                                    >{item}</button>
                                </li>
                            )
                        })}
                    </ul>
                }
            </fieldset>
            {errorFor && <div className='errorMsg'>{errorMsg}</div>}
        </div>
    )
}
