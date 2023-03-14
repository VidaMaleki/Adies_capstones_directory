import Link from "next/link";

const Navbar = () => {
    return (
        <div className="navbar-container">
            <div>
                <Link href="/" className="nav-link">Home</Link>
            </div>
            <div>
                <Link href="/sign-in" className="nav-link">Sign In</Link>
            </div>
        </div>
    )
}

export default Navbar;