
import styles from '@/styles/NavButton.module.css';
import Link from 'next/link';
import { NavButtonProps } from '../types';


const NavButton = ({href, name, isSpecial}: NavButtonProps) => {
  const buttonClassName = isSpecial ? styles.navSignInLink : styles.navLink;
  
  return (
    <div className={styles.navButtonContainer}>
        <Link href={href} className={buttonClassName}>{name}</Link>
    </div>
  )
};

export default NavButton;
