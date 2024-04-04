import styles from './DropdownFieldset.module.scss';
import { DropdownFieldsetProps } from '../../interfaces';
import { useState, useRef, useContext, useCallback } from 'react';
import { FormContext } from '../form_context/page';

export default function DropdownFieldset({ componentName, inputFor, items, errorFor, errorMsg }: DropdownFieldsetProps) {
    const [isListHidden, setIsListHidden] = useState(true);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const itemListRef = useRef<HTMLUListElement>(null);
    const listIndex = useRef(-1);
    const { getValue, setValue } = useContext(FormContext);
    const value = getValue(inputFor);

    const cachedItemSelectEvent = useCallback(
        (e: MouseEvent): void => {
            if (!itemListRef.current?.contains(e.target as Node)) { 
                    setIsListHidden(true);
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

    function handleOpenMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
        // cancel event so document event listener isn't triggered
        if (isListHidden) {
            e.stopPropagation();
            setIsListHidden(false);
            document.addEventListener('click', cachedItemSelectEvent, {once: true});
            document.addEventListener('keydown', cachedEscCloseList);
        }
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

    function handleKeyPress(e: React.KeyboardEvent) {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (listIndex.current > 0) {
                listIndex.current--;
                (itemListRef.current?.children[listIndex.current]?.children[0] as HTMLElement).focus()
            } else if (listIndex.current === 0) {
                (menuButtonRef.current as HTMLElement).focus();
                listIndex.current = -1;
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if ((listIndex.current + 1) < items.length) {
                listIndex.current++;
                (itemListRef.current?.children[listIndex.current]?.children[0] as HTMLElement).focus();
            }
        }
    }
/*
    function handleMenuButtonKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            listIndex.current = -1;
        } else if (e.shiftKey && e.key === 'Tab') {
            e.preventDefault();
            // Navigate to the previous input element
            setIsListHidden(true);
            menuButtonRef.current.parentNode.parentNode.previousElementSibling.children[0].focus();
        } else if (e.key === 'ArrowDown' || e.key === 'Tab') {
            e.preventDefault();
            if (isListHidden) {
                // Sends focus to the next input i.e. minPrice
                menuButtonRef.current.parentNode.parentNode.nextElementSibling.children[0].focus();
            } else {
                // navigate down list
                listIndex.current++;
                itemListRef.current?.children[listIndex.current]?.children[0].focus(); 
            }
        }        
    }*/
// error message is component specific so it can be positioned accordingly

    return (
        <div className={[styles.fieldsetContainer, `${componentName}-fieldsetContainer`].join(' ')}>
            <fieldset>
                <input type='hidden' name={inputFor} value={value} />
                <button
                    ref={menuButtonRef}
                    type='button'
                    className={ errorFor ? [styles.openMenuButton, styles.openMenuButton_error].join(' ') : styles.openMenuButton}
                    onClick={handleOpenMenuClick}
                >{value || 'Select unit'}{errorFor ? ' *' : ''}</button>
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
                                        onKeyDown={handleKeyPress}
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
