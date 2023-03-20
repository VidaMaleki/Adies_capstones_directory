import Link from 'next/link';
import styles from '../styles/AppCard.module.css';



export class AppCard {
    let name: String = "";
    let description: String = "";
    let appLink = "";

    return (
    <div className={styles.card}>
        <div className={styles.content}>
            <h3>{name}</h3>
            <p>{description}</p>
            <Link href={appLink}>View App</Link>
        </div>
    </div>
    );
}

