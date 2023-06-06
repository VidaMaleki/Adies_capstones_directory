
import styles from '@/styles/NavButton.module.css'
import Link from 'next/link';

interface Props {
  href: string;
  name: string;
  isSpecial?: boolean;
}


const NavButton = ({href, name, isSpecial}: Props) => {
  const buttonClassName = isSpecial ? styles.navSignInLink : styles.navLink;

  return (
    <div className={styles.navButtonContainer}>
        <Link href={href} className={buttonClassName}>{name}</Link>
    </div>
  )
}

export default NavButton;
