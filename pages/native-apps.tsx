import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppExtentionPage from '@/components/AppExtentionPage';
import { AppWithIdProps, AppWithDevelopersProps } from '../components/types';

const PAGE_SIZE = 10;

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

const Native = ({ nativeApps }: { nativeApps: AppWithDevelopersProps[] }) => {
  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <AppExtentionPage apps={nativeApps} page="Native apps" pageSize={PAGE_SIZE}/>
    </div>
  );
};

export default Native;
