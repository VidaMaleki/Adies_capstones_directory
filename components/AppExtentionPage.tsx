import AppCard from "@/components/appCard";
import styles from "@/styles/AppPage.module.css"
import { App } from "@prisma/client";

interface Props {
    apps: App[];
    page: string;
}


const AppList = ({ apps , page}: Props) => {
    return (
        <div className={styles.pageContainer}>
            <h1 className={styles.appHeader}>{page}</h1>
            <div className={styles.appListContainer}>
            {apps.map((app) => (
                <AppCard key={app.id} app={app} />
            ))}
            </div>
        </div>
    );
};

export default AppList;