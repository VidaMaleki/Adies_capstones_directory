import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import AppCard from "@/components/AppCard";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import { AppWithIdProps } from "@/components/types";

export async function getStaticProps() {
  const gameApps: App[] = await db.app.findMany({
    where: {
      type: "game",
    },
  });
  return {
    props: {
      gameApps: gameApps,
    },
  };
}

const Games = ({ gameApps }: { gameApps: AppWithIdProps[] }) => {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.pageContainer}>
        <h1 className={styles.appHeader}>Gaming Apps</h1>
        {/* loop through web apps to create AppCards */}
        <div className={styles.appsContainer}>
          {gameApps.map((app) => (
            <AppCard key={app.id} app={app}></AppCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;
