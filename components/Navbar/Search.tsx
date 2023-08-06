import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Search.module.css";
import { FaSearch } from "react-icons/fa";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      // Check window width and update showSearchBar accordingly
      setShowSearchBar(window.innerWidth >= 700);
    };

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Reset event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to the search results page with the search query as a query parameter
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);

    // Clear the search input field
    setSearchTerm("");
  };

  const handleToggleSearch = () => {
    router.push("/search");
    // Toggle the visibility of the search bar
    setShowSearchBar((prevState) => !prevState);
  };

  return (
    <div className={styles.searchContainer}>
      <div
        className={showSearchBar ? styles.searchForm : styles.searchFormHidden}
      >
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className={styles.searchIcon}>
            <FaSearch />
          </button>
        </form>
      </div>
      <button onClick={handleToggleSearch} className={styles.searchIcon}>
        <FaSearch />
      </button>
    </div>
  );
};

export default Search;