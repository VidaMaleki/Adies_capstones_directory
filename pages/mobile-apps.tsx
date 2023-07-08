import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import AppCard from "@/components/AppCard";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import { AppWithDevelopersProps, AppWithIdProps } from "@/components/types";

export async function getStaticProps() {
  const mobileApps: App[] = await db.app.findMany({
    where: {
      type: "mobile",
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
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.pageContainer}>
        <h1 className={styles.appHeader}>Mobile Apps</h1>
        {/* loop through web apps to create AppCards */}
        <div className={styles.appsContainer}>
          {mobileApps.map((app) => (
            <AppCard key={app.id} app={app}></AppCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileApps;
