import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import AppExtentionPage from "@/components/AppExtentionPage";
import { AppWithDevelopersProps } from "../components/types";
import { useState, useEffect } from "react";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAGE_SIZE = 10;

const NativeApp = () => {
  const [nativeApps, setNativeApps] = useState<AppWithDevelopersProps[]>([]);
  const app_url = `${process.env.NEXT_PUBLIC_APP_URL}`;

  async function fetchData() {
    try {
      const res = await axios.get(app_url);
      const allApps: AppWithDevelopersProps[] = res.data.apps;
      if (allApps.length > 0) {
        const nativeApps = allApps.filter((app) => app.type === "Native");
        setNativeApps(nativeApps);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageWrapper}>
        <AppExtentionPage
          apps={nativeApps}
          page="Native Apps"
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default NativeApp;
