import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/AppPage.module.css";
import AppExtentionPage from "@/components/AppExtentionPage";
import { AppWithDevelopersProps } from "../components/types";
import { useState, useEffect } from "react";
import axios from "axios";

const PAGE_SIZE = 10;

const MobileApp = () => {
  const [mobileApps, setMobileApps] = useState<AppWithDevelopersProps[]>([]);
  const APP_URL = "/api/appRoutes";

  async function fetchData() {
    try {
      const res = await axios.get(APP_URL);
      const allApps: AppWithDevelopersProps[] = res.data.apps;
      if (allApps.length > 0) {
        const mobileApps = allApps.filter((app) => app.type === "Mobile");
        setMobileApps(mobileApps);
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
          apps={mobileApps}
          page="Mobile Apps"
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  );
};

export default MobileApp;
