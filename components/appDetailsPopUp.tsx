import styles from '@/styles/appDetailsPopup.module.css';
import * as FaIcons from "react-icons/fa";


interface Props {
    app: {
        appName: string;
        description: string;
        appLink: string | null;
        id: number;
        github: string | null;
        videoLink: string | null,
        technologies: string[],
        developers: string[]
    };
    onClose: () => void;
}

const AppDetailsPopup: React.FC<Props> = ({ app, onClose }) => {
    const image = "https://img.freepik.com/free-vector/isometric-3d-computer-laptop-tablet-pc-smartphone_1284-51716.jpg?w=1380&t=st=1681421310~exp=1681421910~hmac=4256a4d5ec8193b087196488c66522210fca664163bacf6fa3fc32061c2f7a0c";
    const developersElement = app.developers.length === 1 ? app.developers[0] : app.developers.join(', ');

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <button className={styles.closeButton} onClick={onClose}>
                X
                </button>
                <div className={styles.appContentContainer}>
                    <div className={styles.imageContainer}>
                        {/* change to Image from next/image */}
                        <img src={image} alt="graphic of computers" />
                    </div>
                    <div className={styles.textContainer}>
                        <h2>{app.appName}</h2>
                        <p>Created by: {developersElement}</p>
                        <p>Description: {app.description}</p>
                        <p>Technologies: {app.technologies.join(', ')}</p>
                        <div className={styles.links}>
                            {app.github && <a href={app.github} target="_blank"><FaIcons.FaGithub /></a>}
                            {app.appLink && <a href={app.appLink} target="_blank">View App</a>}
                            {app.videoLink && <a href={app.videoLink} target="_blank">Demo Video</a>}
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