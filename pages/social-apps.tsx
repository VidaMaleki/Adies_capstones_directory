import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppList from '@/components/AppExtentionPage';


export async function getStaticProps() {
  const socialApps: App[] = await db.app.findMany({
    where: {
      type: "Social",
    },
  });
  return {
    props: {
      socialApps: socialApps,
    },
  };
}

const SocialMedia = ({ socialApps }: { socialApps: App[] }) => {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <AppList apps={socialApps} page="Social media apps" />
    </div>
  );
};

export default SocialMedia;
