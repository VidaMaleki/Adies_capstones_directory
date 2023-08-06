import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppExtentionPage from '@/components/AppExtentionPage';
import { AppWithDevelopersProps } from '../components/types';

const PAGE_SIZE = 10;

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

const MobileApps = ({ mobileApps }: { mobileApps: AppWithDevelopersProps[] }) => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <AppExtentionPage apps={mobileApps} page="Mobile apps" pageSize={PAGE_SIZE}/>
    </div>
  );
};

export default MobileApps;
