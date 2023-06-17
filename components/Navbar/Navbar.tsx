import LOGO from "../../images/appLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import ProfileIcon from "../profile/ProfileIcon";
import styles from "@/styles/Navbar.module.css";
import NavButton from "./NavButton";
import Search from "./Search";
import { useEffect, useState } from "react";

interface Props {}

const Navbar: React.FunctionComponent<Props> = () => {
  // const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      id="navbar"
      className={`${styles.navbarContainer} ${
        scrolling ? styles.navbarContainerScroll : ""
      }`}
    >
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
        <NavButton href={"/"} name={"Home"} />
        <NavButton href={"/about"} name={"About"} />
        <NavButton href={"/auth"} name={"Sign in"} isSpecial={true} />
      </div>
      <div>{router.pathname === "/" && <Search />}</div>
      <div className={styles.profileContainer}>
        <ProfileIcon />
      </div>
    </div>
  );
};

export default Navbar;
