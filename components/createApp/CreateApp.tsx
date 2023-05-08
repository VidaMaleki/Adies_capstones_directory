import styles from '@/styles/appDetailsPopup.module.css';
import { db } from '@/lib/db';
import App from '@/pages/_app';

interface CreateAppProps {
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
    onClick: () => void;
}

const CreateApp: React.FC<CreateAppProps> = ({ app, onClick }) => {
    const image = db.app.findUnique({where:{picture: app.}})

    return (
        <div></div>
    );
};

export default CreateApp;