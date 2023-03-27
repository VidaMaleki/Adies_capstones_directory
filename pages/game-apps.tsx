import Navbar from "@/components/Navbar";
import styles from "@/styles/AppPage.module.css"
import apps from "../app-data/app-data.json"
import AppCard from "@/components/appCard";

const Games = () => {
    const gameApps: any[] = [];
    apps.forEach(app => {
        if (app.type === "game") {
        gameApps.push(app)
        }
    });
    return (
        <div className={styles.pageWrapper}>
            <Navbar />
            <div className={styles.pageContainer}>
                <h1 className={styles.appHeader}>Gaming Apps</h1>
                {/* loop through web apps to create AppCards */}
                <div className={styles.appsContainer}>
                    {gameApps.map((app)=> (
                        <AppCard  name={app.appName} description={app.description} appLink={app.appLink} key={app.id} linkedin={app.linkedin}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Games;