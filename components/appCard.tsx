import Link from 'next/link';
import styles from '@/styles/AppCard.module.css';


const AppCard = ({name, description, appLink} : {
    name: string,
    description: string,
    appLink: string
}) => {
    // let name: String = "Example";
    // let description: String = "Example description";
    // let appLink = "https://google.com";

    return (
        <div className={styles.card}>
            <div className={styles.content}>
                <h3>{name}</h3>
                <p>{description}</p>
                <Link href={appLink} target="_blank">View App</Link>
            </div>
        </div>
    );
}
export default AppCard;
