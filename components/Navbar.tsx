import Link from "next/link";
import LOGO from '../images/appLogo.png';
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import ProfileIcon from "./profile/ProfileIcon";
import { Developer } from "@prisma/client";
import { useEffect, useState } from "react";
import styles from '@/styles/Navbar.module.css'


interface Props {

}

const Navbar: React.FunctionComponent<Props> = () => {
    const router = useRouter();
    // const [developers, setDevelopers] = useState<Developer[]>([])

    // useEffect(() => {
    //     const fetchDevelopers = async () => {
    //         const res = await fetch("/api/developers")
    //         const data = await res.json();
    //         setDevelopers(data);
    //     };
    //     fetchDevelopers();
    // }, []);

    // const handleProfileClick = () => {
    //     router.push('/profile');
    // }
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.logoContainer}>
                <Image className={styles.appLogo} src={LOGO} alt="Image" priority />
            </div>
            <div className={styles.buttonWrapper}>
                <div className={styles.navButtonContainer}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                </div>
                <div className={styles.navButtonContainer}>
                    <Link href="/about" className={styles.navLink}>About</Link>
                </div>
                <div className={styles.navButtonContainer}>
                    <Link href="/auth" className={styles.navSignInLink}>Sign in</Link>
                </div>
            </div>
            <div className={styles.searchContainer}>
                <form 
                className={styles.searchForm}
                action="/action_page.php">
                    <input 
                    className={styles.searchInput}
                    type="text" 
                    placeholder="Search..." 
                    name="search"
                    />
                </form>
                <button type="submit" className={styles.searchIcon}><FaSearch/></button>
            </div>
            <div className={styles.profileContainer}>
                <ProfileIcon/>
            </div>
        </div>
    )
}

export default Navbar;