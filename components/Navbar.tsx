import Link from "next/link";
import LOGO from '../images/appLogo.png';
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import ProfileIcon from "./profile/ProfileIcon";
import styles from '@/styles/Navbar.module.css'


interface Props {

}

const Navbar: React.FunctionComponent<Props> = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/");
    };
    
    return (
        <div className={styles.navbarContainer}>
            <div className={styles.logoContainer}>
                <Image
                className={styles.appLogo}
                src={LOGO}
                alt="Image"
                priority
                onClick={handleClick}
                />
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
            {router.pathname === "/" && (
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
            )}
                <div className={styles.profileContainer}>
                <ProfileIcon/>
                </div>
        </div>
    )
}

export default Navbar;