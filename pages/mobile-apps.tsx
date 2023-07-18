import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppList from '@/components/AppExtentionPage';
import { AppWithIdProps } from '../components/types';

export async function getStaticProps() {
  const mobileApps: App[] = await db.app.findMany({
    where: {
      type: "Mobile",
    },
  });
  return {
    props: {
      mobileApps: mobileApps,
    },
  };
}

const MobileApps = ({ mobileApps }: { mobileApps: AppWithIdProps[] }) => {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <AppList apps={mobileApps} page="Mobile apps" />
    </div>
  );
};

export default MobileApps;
