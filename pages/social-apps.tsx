import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import AppCard from "@/components/AppCard";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import { AppWithIdProps } from "@/components/types";

export async function getStaticProps() {
  const socialApps: App[] = await db.app.findMany({
    where: {
      type: "social",
    },
  });
  return {
    props: {
      socialApps: socialApps,
    },
  };
}

const SocialMedia = ({ socialApps }: { socialApps: AppWithIdProps[] }) => {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.pageContainer}>
        <h1 className={styles.appHeader}>Social Apps</h1>
        {/* loop through web apps to create AppCards */}
        <div className={styles.appsContainer}>
          {socialApps.map((app) => (
            <AppCard key={app.id} app={app}></AppCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMedia;
