import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppList from "@/components/AppExtentionPage";
import { AppWithIdProps } from "@/components/types";

export async function getStaticProps() {
  const webApps: App[] = await db.app.findMany({
    where: {
      type: "web",
    },
  });
  return {
    props: {
      webApps,
    },
  };
}

const WebApps = ({ webApps }: { webApps: AppWithIdProps[] }) => {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <AppList apps={webApps} page="Web Apps" />
    </div>
  );
};

export default WebApps;
