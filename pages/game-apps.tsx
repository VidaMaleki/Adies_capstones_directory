import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppList from '@/components/AppExtentionPage';

export async function getStaticProps() {
  const gameApps: App[] = await db.app.findMany({
    where: {
      type: "Game",
    },
  });
  return {
    props: {
      gameApps: gameApps,
    },
  };
}

const Games = ({ gameApps }: { gameApps: App[] }) => {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <AppList apps={gameApps} page="Game apps" />
    </div>
  );
};

export default Games;
