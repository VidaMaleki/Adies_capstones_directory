import Link from "next/link";
import LOGO from '../images/LOGO.png';
import Image from 'next/image'

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
        </div>
    )
}

export default Navbar;