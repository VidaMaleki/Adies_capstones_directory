import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/Search.module.css'
import { FaSearch } from "react-icons/fa";



const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Redirect to the search results page with the search query as a query parameter
        router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
        
        // Clear the search input field
        setSearchTerm('');
    };

    return (
        <div className={styles.searchContainer}>
            <form 
            onSubmit={handleSearch}
            className={styles.searchForm}>
                <input
                className={styles.searchInput}
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className={styles.searchIcon}><FaSearch/></button>
            </form>
        </div>
    );
};

export default Search;