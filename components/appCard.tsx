import AppDetailsPopup from './AppDetailsPopUp';
import Link from 'next/link';
import styles from '@/styles/AppCard.module.css';
import * as FaIcons from 'react-icons/fa';
import { useState } from 'react';
import { AppWithDevelopersProps, AppWithIdProps } from './types';
import { NextPageContext } from 'next';
import { getSession } from "next-auth/react";
import { db } from '@/lib/db';


export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    let userEmail = session?.user?.email ? session.user.email : '';

    const signedInUser = await db.developer.findUnique({
        where: {
        email: userEmail,
        },
        include: {
        app: {
            include: {
            developers: true, // Include the developers associated with the app
            },
        },
        },
    });

    return {
        props: {
        session,
        signedInUser,
        },
    };
}

const AppCard = ({app}: {app: AppWithDevelopersProps }) => {
    console.log(app); // Log the app prop to inspect its data
    const name = app?.appName ?? 'No name available';
    const appLink = app?.appLink ?? '#';
    const github = app?.github ?? '#';
    const technologies = app.technologies;
    const picture = app.picture;
    const developers = app.developers ?? ""
    
    console.log(developers)

    const [showPopup, setShowPopup] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const developerNames = developers?.map((developer) => developer.fullName) ?? [];
    const developerNamesString = developerNames.join(', ') ?? '';
    // const developerList = Array.isArray(developers) ? (
    //     developers.map((developer) => <li key={developer.id}>{developer.fullName}</li>)
    // ) : (
    // <li>{developers}</li> // Display the string as a single list item
    // );
    return (
        <div className={styles.card}>
        <div className={styles.appMiniScreen} style={{ backgroundImage: `url(${picture})` }} onClick={handleOpenPopup}></div>
        <div className={styles.content}>
            <div className={styles.appCardHeader}>
            <h3>{name}</h3>
            <a className={styles.cardGitHub} href={github} target="_blank">
                <div className={styles.iconContainer}>
                <FaIcons.FaGithub />
                </div>
            </a>
            </div>
            <h3>Created by: {developerNamesString}</h3>
            <h3>Tech Stack: {technologies.join(', ')}</h3>
        </div>
        <div className={styles.cardFooterButtons}>
            <Link href={appLink} className={styles.cardView} target="_blank">
            View
            </Link>
            <button className={styles.cardDetails} onClick={() => handleOpenPopup()}>
            Details
            </button>
        </div>
        {showPopup && <AppDetailsPopup app={app} onClose={handleClosePopup} />}
        </div>
    );
};

export default AppCard;

