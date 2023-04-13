import AppDetailsPopup from './appDetailsPopUp';
import Link from 'next/link';
import styles from '@/styles/AppCard.module.css';
import * as FaIcons from "react-icons/fa";
import { useState } from 'react';
import { App } from '@prisma/client';

// interface Props {
//     app: Props;
//     onClose: () => void;
// }

// interface Props {
//     appName: string;
//     description: string;
//     appLink: string;
//     linkedin: string;
//     id: string;
    
// }

const AppCard = ({ app }: {
    app: App,
}) => {
    const name = app?.appName ?? 'No name available';
    const description = app?.description ?? 'No description available';
    const appLink = app?.appLink ?? '#';
    const github = app?.github ?? '#';
    const videoLink = app?.videoLink ?? '#';
    const technologies = app.technologies;
    const id = app?.id ?? -1;

    const [showPopup, setShowPopup] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };
    return (
        <div className={styles.card}>
            <div className={styles.appMiniScreen}></div>
            <div className={styles.content}>
                <div className={styles.appCardHeader}>
                    <h3>{name}</h3>
                    <a className={styles.cardGitHub} href={github} target="_blank" >
                        <div className={styles.iconContainer}>
                            <FaIcons.FaGithub />
                        </div>
                    </a>
                </div>
                <p>{description}</p>
            </div>
            <div className={styles.cardFooterButtons}>
                <Link href={appLink} className={styles.cardView} target="_blank">
                    View
                </Link>
                <button className={styles.cardDetails} onClick={() => handleOpenPopup()}>Details</button>
            </div>
            {showPopup && (
                <AppDetailsPopup app={app} onClose={handleClosePopup}/>
            )}
        </div>
    );
}
export default AppCard;
