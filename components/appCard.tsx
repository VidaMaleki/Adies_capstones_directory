import AppDetailsPopup from './appDetailsPopUp';
import Link from 'next/link';
import styles from '@/styles/AppCard.module.css';
import * as FaIcons from "react-icons/fa";
import { useState } from 'react';
import { App } from '@prisma/client';
import { db } from '@/lib/db';

// export async function getStaticProps() {
//     const appDevelopers = await db.developer.findMany({
//         where: {
//             id: {in: developersIDs}
//         }
//     });
//     return {
//         props: {
//             appDevelopers: appDevelopers,
//         },
//     }
// }
    // const getDeveloperNames = async () => {
    //     const appDevelopers = await db.developer.findMany({
    //         where: {
    //             id: {in: developersIDs}
    //         }
    //     })
    //     return appDevelopers.map(elem => elem.fullName);
    // }

const AppCard = ({ app }: {
    app: App,
}) => {


    const name = app?.appName ?? 'No name available';
    const appLink = app?.appLink ?? '#';
    const github = app?.github ?? '#';
    const technologies = app.technologies;
    const developers = app.developers;
    // const developersIDs = app.developers.map(elem => parseInt(elem));
    // const developerNames = getDeveloperNames();
    
    
    const [showPopup, setShowPopup] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const developersElement = developers.length === 1 ? developers[0] : developers.join(', ');
    
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
                <p>Created by: {developersElement}</p>
                <p>Tech Stack: {technologies.join(', ')}</p>
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
