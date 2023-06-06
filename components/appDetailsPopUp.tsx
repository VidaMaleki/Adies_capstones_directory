import styles from '@/styles/appDetailsPopup.module.css';
import * as FaIcons from "react-icons/fa";
import Image from 'next/image';
import { db } from '@/lib/db';
import { useEffect, useState } from 'react';
interface Props {
    app: {
        appName: string;
        description: string;
        appLink: string | null;
        id: number;
        github: string | null;
        videoLink: string | null;
        technologies: string[];
        developers: {fullName: string}[];
        picture: string
    };
    onClose: () => void;
}

const AppDetailsPopup: React.FC<Props> = ({ app, onClose }) => {
    // const defaultImage = "https://img.freepik.com/free-vector/isometric-3d-computer-laptop-tablet-pc-smartphone_1284-51716.jpg?w=1380&t=st=1681421310~exp=1681421910~hmac=4256a4d5ec8193b087196488c66522210fca664163bacf6fa3fc32061c2f7a0c";
    // const developersName = app.developers.length === 1 ? app.developers[0] : app.developers.join(', ');
    const developers = app.developers;

    const developersElement = developers && developers.length === 1 ? developers[0] : developers?.join(', ') ?? '';


    // const [developerName, setDeveloperName] = useState('')

    // useEffect(() => {
    //     async function fetchDeveloperName() {
    //         try {
    //             const response = await db.app.findUnique({
    //             where: { id: app.id },
    //             select: { owner: { select: { fullName: true } } }
    //             });
    //             setDeveloperName(response.owner.fullName);
    //         } catch (error) {
    //             console.error('Error fetching developer name:', error);
    //         }
    //     }
    
    //     fetchDeveloperName();
    //   }, [app.id]);
    
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <div className={styles.closingPop}>
                    <button className={styles.closeButton} onClick={onClose}>
                    X
                    </button>
                </div>
                <div className={styles.appContentContainer}>
                    <div className={styles.imageContainer}>
                        {/* change to Image from next/image */}
                        <Image src={app.picture} alt="graphic of computers" width={700} height={500} />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.appDetailsContainer}>
                            <div className={styles.appPopupTitleWraper}>
                                <h2 className={styles.appPopupTitle}>
                                    {app.appName}
                                </h2>
                                {app.github && <a href={app.github} target="_blank"><FaIcons.FaGithub /></a>}
                            </div>
                            
                            <h3 className={styles.appPopupText}>Created by: 
                                <p className={styles.appPopupSubText}>{String(developersElement)}</p> 
                            </h3>
                            <h3 className={styles.appPopupText}>Description:
                                <p className={styles.appPopupSubText}>{app.description}</p> 
                            </h3>
                            <h3 className={styles.appPopupText}>Technologies:
                                <p className={styles.appPopupSubText}>{app.technologies.join(', ')}</p> 
                            </h3>
                        </div>
                        <div className={styles.viewApplinks}>
                            {app.appLink && (
                                <a href={app.appLink} target="_blank">
                                View App
                                </a>
                            )}
                            {!app.appLink && app.videoLink && (
                                <a href={app.videoLink} target="_blank">
                                View Video
                                </a>
                            )}
                            {!app.appLink && !app.videoLink && app.github && (
                                <a href={app.github} target="_blank">
                                View GitHub
                                </a>
                            )}
                        </div>
                    </div>
                    
                </div>
                {/* Need to pull linked in from Developer table */}
                {/* <a href={app.linkedin}>View LinkedIn</a> */}
            </div>
        </div>
    );
};

export default AppDetailsPopup;