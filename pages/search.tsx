import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AppCard from "@/components/AppCard";
import styles from "@/styles/Search.module.css";
import { AppWithDevelopersProps } from "../components/types";
import Search from "@/components/Navbar/Search";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";

const SearchPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<AppWithDevelopersProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      console.log("search fetch");
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/search?search=${query}`);
        console.log("response", response.data);
        setSearchResults(response.data.apps);

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className={styles.searchResultsContainer}>
      <Navbar />
      <div className={styles.searchResultsWrapper}>
        <div className="flex items-center mb-4">
          <h2 className="text-2xl">Search Results for &quot;{query}&quot;</h2>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : searchResults.length === 0 ? (
          <div>No apps found.</div>
        ) : (
          <div className={styles.searchResults}>
            {searchResults.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
