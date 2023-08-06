import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppExtentionPage from "@/components/AppExtentionPage";
import { AppWithDevelopersProps } from '../components/types';

const PAGE_SIZE = 10;

export async function getStaticProps() {
  const webApps: App[] = await db.app.findMany({
    where: {
      type: "Web",
    },
  });
  return {
    props: {
      webApps,
    },
  };
}

const WebApps = ({ webApps }: { webApps: AppWithDevelopersProps[] }) => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageWrapper}>
        <AppExtentionPage apps={webApps} page="Web Apps" pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
};

export default WebApps;
