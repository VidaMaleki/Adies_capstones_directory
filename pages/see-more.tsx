import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AppExtentionPage from '@/components/AppExtentionPage';
import axios from 'axios';
import { AppWithDevelopersProps } from '@/components/types';
import Navbar from '@/components/Navbar/Navbar';
import styles from "@/styles/AppPage.module.css";

const PAGE_SIZE = 10;

const capitalizeFirstLetter = (type:any) => {
  if (typeof type !== 'string' || type.length === 0) {
    return 'Extended';
  }
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const SeeMore = () => {
  const router = useRouter();
  const { type } = router.query;
  const [apps, setApps] = useState<AppWithDevelopersProps[]>([]);

  const app_url = `${process.env.NEXT_PUBLIC_APP_URL}`;

  async function fetchData() {
    try {
      const res = await axios.get(app_url);
      const allApps: AppWithDevelopersProps[] = res.data.apps;
      console.log("Type:", type);
      console.log("Number of all apps:", allApps.length);
      if (allApps.length > 0) {
        const filteredApps = allApps.filter((app) => app.type.toLowerCase() === (type ? type.toString().toLowerCase() : ''));
        console.log("Number of filtered apps:", filteredApps.length);
        setApps(filteredApps);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (type) {
      fetchData();
    }
  }, [type]);

  

  return (
    <div className={styles.pageContainer}>
      <Navbar />
      <div className={styles.pageWrapper}>
        <AppExtentionPage apps={apps} page={`${capitalizeFirstLetter(type)} Apps`} pageSize={PAGE_SIZE} />
      </div>
    </div>
  );
};

export default SeeMore;