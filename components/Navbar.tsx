import Link from "next/link";

const Navbar = () => {
    return (
        <div>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/sign-in">Sign In</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar;