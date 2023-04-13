import styles from '@/styles/appDetailsPopup.module.css';

interface Props {
    app: {
        appName: string;
        description: string;
        appLink: string | null;
        id: number;
        github: string | null;
        videoLink: string | null,
        technologies: string[]
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
                <div className={styles.links}>
                    {app.appLink && <a href={app.appLink} target="_blank">View App</a>}
                    {app.github && <a href={app.github} target="_blank">Github</a>}
                    {app.videoLink && <a href={app.videoLink} target="_blank">Demo Video</a>}
                </div>
                
                {/* Need to pull linked in from Developer table */}
                {/* <a href={app.linkedin}>View LinkedIn</a> */}
            </div>
        </div>
    );
};

export default AppDetailsPopup;