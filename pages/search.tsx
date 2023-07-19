import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AppCard from "@/components/AppCard";
import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/Search.module.css";
import { AppWithDevelopersProps } from '../components/types';

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<AppWithDevelopersProps[]>([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`/api/appRoutes?search=${query}`);
        console.log(response.data);
        setSearchResults(response.data.apps);
      } catch (error) {
        console.error(error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className={styles.searchResultsContainer}>
      <Navbar />
      <div className={styles.searchResults}>
        <h2>Search Results for &quot;{query}&quot;</h2>
        <div>
          {searchResults.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
