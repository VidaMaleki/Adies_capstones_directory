import Navbar from "@/components/Navbar";
import styles from "@/styles/AppPage.module.css"
import apps from "../app-data/app-data.json"
import AppCard from "@/components/appCard";

const WebApps = () => {
    // fetch all the web apps from db
    const webApps: any[] = [];
    apps.forEach(app => {
        if (app.type === "web") {
        webApps.push(app)
        }
    });

    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={styles.pageContainer}>
                <h1 className={styles.appHeader}>Web Apps</h1>
                {/* loop through web apps to create AppCards */}
                <div className={styles.appsContainer}>
                    {webApps.map((app)=> (
                        <AppCard  name={app.appName} description={app.description} appLink={app.appLink} key={app.id}/>
                    ))}
                </div>
            </div>
        </div>
        
    )
}

export default WebApps;