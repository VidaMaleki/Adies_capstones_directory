import styles from '@/styles/appDetailsPopup.module.css';

interface Props {
    app: {
        appName: string;
        description: string;
        appLink: string;
        id: string;
        linkedin: string;
        // type: string;
    };
    onClose: () => void;
}

const AppDetailsPopup: React.FC<Props> = ({ app, onClose }) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.closeButton} onClick={onClose}>
                X
                </button>
                <h2>{app.appName}</h2>
                <p>{app.description}</p>
                <a href={app.appLink}>View App</a>
                <a href={app.linkedin}>View LinkedIn</a>
            </div>
        </div>
    );
};

export default AppDetailsPopup;