import styles from './Info.module.scss';
import { useState } from 'react';
import { InfoProps } from '../../../types/interfaces';

export default function Info({ infoContent }: InfoProps) {
    const [infoHidden, setInfoHidden] = useState(true);
    return (
        <span className={styles.infoContainer}>
            <button
                type='button'
                className={styles.infoButton}
                onMouseEnter={() => setInfoHidden(false)}
                onMouseLeave={() => setInfoHidden(true)}
                onFocus={() => setInfoHidden(false)}
                onBlur={() => setInfoHidden(true)}
                onClick={(e) => e.preventDefault()}
                aria-expanded={infoHidden ? 'false' : 'true'}
                aria-controls='info-container'
            >?</button>
            <div
                id='info-container'
                className={styles.infoContent}
                hidden={infoHidden}
            >{infoContent}</div>
        </span>
    )
}