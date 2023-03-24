import Link from 'next/link';
import styles from '@/styles/AppCard.module.css';
import * as FaIcons from "react-icons/fa";

const AppCard = ({name, description, appLink, linkedin} : {
    name: string,
    description: string,
    appLink: string,
    linkedin: string
}) => {
    // let name: String = "Example";
    // let description: String = "Example description";
    // let appLink = "https://google.com";

    return (
        <div className={styles.card}>
            <div className={styles.appMiniScreen}></div>
            <div className={styles.content}>
                <div className={styles.appCardHeader}>
                    <h3>{name}</h3>
                    <a className={styles.cardLinkedin} href={linkedin} target="_blank" >
                    <div className={styles.iconContainer}>
                        <FaIcons.FaLinkedin />
                    </div>
                    </a>
                </div>
                <p>{description}</p>
                <Link href={appLink} target="_blank">View App</Link>
            </div>
            <div className={styles.cardFooterButtons}>
                <button className={styles.cardView}>View</button>
                <button className={styles.cardDetails}>Details</button>
            </div>
        </div>
    );
}
export default AppCard;
