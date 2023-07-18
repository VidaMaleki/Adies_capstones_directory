import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppList from '@/components/AppExtentionPage';
import { AppWithIdProps } from '../components/types';

export async function getStaticProps() {
  const nativeApps: App[] = await db.app.findMany({
    where: {
      type: "Native",
    },
  });
  return {
    props: {
      nativeApps: nativeApps,
    },
  };
}

const Games = ({ nativeApps }: { nativeApps: AppWithIdProps[] }) => {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <AppList apps={nativeApps} page="Native apps" />
    </div>
  );
};

export default Games;
