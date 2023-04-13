import Navbar from "@/components/Navbar";
import styles from "@/styles/AppPage.module.css"
import AppCard from "@/components/appCard";
import { db } from "@/lib/db";
import { App } from "@prisma/client";

export async function getStaticProps() {
    const webApps: App[] = await db.app.findMany({
        where: {
            type: "web"
        }
    });
    return {
        props: {
            webApps,
        },
    }
}

const WebApps = ({ webApps } : {
    webApps: App[];
}) => {

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={styles.pageContainer}>
                <h1 className={styles.appHeader}>Web Apps</h1>
                {/* loop through web apps to create AppCards */}
                <div className={styles.appsContainer}>
                    {webApps.map((app) => (
                        <AppCard key={app.id}  app={app}></AppCard>
                    ))}
                </div>
            </div>
        </div>
        
    )
}

export default WebApps;