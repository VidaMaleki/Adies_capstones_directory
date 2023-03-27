import Navbar from "@/components/Navbar";
import styles from "@/styles/AppPage.module.css"
import apps from "../app-data/app-data.json"
import AppCard from "@/components/appCard";

const MobileApps = () => {
    const mobileApps: any[] = [];
    apps.forEach(app => {
        if (app.type === "game") {
        mobileApps.push(app)
        }
    });

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={styles.pageContainer}>
                <h1 className={styles.appHeader}>Mobile Apps</h1>
                {/* loop through web apps to create AppCards */}
                <div className={styles.appsContainer}>
                    {mobileApps.map((app)=> (
                        <AppCard  name={app.appName} description={app.description} appLink={app.appLink} key={app.id} linkedin={app.linkedin}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MobileApps;