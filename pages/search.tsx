import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import AppCard from "@/components/App/AppCard";
import styles from "@/styles/Search.module.css";
import { AppWithDevelopersProps } from "../components/types";
import Navbar from "@/components/Navbar/Navbar";
import { FaSearch } from "react-icons/fa";

const SearchPage = () => {
  const router = useRouter();
  const search_page = `${process.env.NEXT_PUBLIC_SEARCH}`;
  const [searchTerm, setSearchTerm] = useState("");
  const { query } = router.query;
  const [searchResults, setSearchResults] = useState<AppWithDevelopersProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to the search results page with the search query as a query parameter
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);

    // Clear the search input field
    setSearchTerm("");
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      console.log("search fetch");
      setIsLoading(true);
      try {
        const response = await axios.get(`${search_page}?search=${query}`);
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
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBarForm}>
            <form onSubmit={handleSearch} className={styles.searchBarForm}>
              <input
                className={styles.searchBarInput}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className={styles.searchBarIcon}>
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
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
