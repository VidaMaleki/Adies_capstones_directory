import Link from "next/link";
import LOGO from '../images/LOGO.png';
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";

const Navbar = () => {
    return (
        <div className="navbar-container">
            <Image id="nav-img" src={LOGO} alt="Image" />
            <div>
                <Link href="/" id="nav-link">Home</Link>
            </div>
            <div>
                <Link href="/sign-in" id="nav-link">Sign In</Link>
            </div>
            <div className="search-container">
                <form action="/action_page.php">
                    <input type="text" placeholder="Search.." name="search"/>
                <button type="submit"><FaSearch/></button>
                </form>
            </div>
        </div>
    )
}

export default Navbar;