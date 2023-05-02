import Link from "next/link";
import LOGO from '../images/appLogo.png';
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import ProfileIcon from "./profile/ProfileIcon";
import { Developer } from "@prisma/client";
import { useEffect, useState } from "react";


interface Props {

}

const Navbar: React.FunctionComponent<Props> = () => {
    const router = useRouter();
    const [developers, setDevelopers] = useState<Developer[]>([])

    useEffect(() => {
        const fetchDevelopers = async () => {
            const res = await fetch("/api/developers")
            const data = await res.json();
            setDevelopers(data);
        };
        fetchDevelopers();
    }, []);

    // const handleProfileClick = () => {
    //     router.push('/profile');
    // }
    return (
        <div className="navbar-container">
            <div>
                <Image id="nav-img" src={LOGO} alt="Image" priority />
            </div>
            <div className="button-wrapper">
                <div >
                    <Link href="/" className="nav-link">Home</Link>
                </div>
                <div>
                    <Link href="/about" className="nav-link">About</Link>
                </div>
                <div>
                    <Link href="/auth" className="nav-link">Sign up</Link>
                </div>
            </div>
            <div className="search-container">
                <form action="/action_page.php">
                    <input 
                    type="text" 
                    placeholder="Search..." 
                    name="search"
                    />
                </form>
                <button type="submit" className="search-icon"><FaSearch/></button>
            </div>
            <div className="">
                <ProfileIcon/>
            </div>
        </div>
    )
}

export default Navbar;