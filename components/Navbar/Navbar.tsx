import LOGO from "../../images/appLogo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import ProfileIcon from "../profile/ProfileIcon";
import styles from "@/styles/Navbar.module.css";
import NavButton from "./NavButton";
import Search from "./Search";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface Props {}

const searchVisiblePages = [
  "/",
  "/search",
  "/web-apps",
  "/mobile-apps",
  "native-apps",
];

const Navbar: React.FunctionComponent<Props> = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/");
  };

  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    const handleRouteChange = () => {
      setScrolling(false);
    };

    window.addEventListener("scroll", handleScroll);
    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div
      id="navbar"
      className={`${styles.navbarContainer} ${
        scrolling || router.pathname !== "/" ? styles.navbarContainerScroll : ""
      }`}
    >
      <div className={styles.navbarWrapper}>
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
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>
            <h2>Menu</h2>
            <i className="fas fa-caret-down"></i>
          </button>
          <div className={styles.dropdownContent}>
            <a href={"/"}>Home</a>
            <a href={"/about"}>About</a>
            <a href={"/auth"}>Sign in</a>
          </div>
        </div>
        <div className={styles.search}>
          {searchVisiblePages.includes(router.pathname) && <Search />}
        </div>
      </div>
      <div className={styles.profileContainer}>
        <ProfileIcon />
      </div>
    </div>
  );
};

export default Navbar;
