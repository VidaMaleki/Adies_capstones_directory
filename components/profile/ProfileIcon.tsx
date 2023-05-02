import Image from "next/image";
import Link from "next/link";
import { Developer } from "@prisma/client";
import styles from '@/styles/Profile.module.css';
import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { AiFillGithub } from "react-icons/ai";

interface Props {
  
}

const ProfileIcon = () => {
  const { data: session } = useSession()
  // const hasImage = !!developer.image;
  // const imageSrc = hasImage ? developer.image : "/default-profile.png";

  return (
    <Link href="/profile">
        <div className={styles.imageWrapper}>
          <Image
            src={session?.user?.image!}
            alt="Developer profile image"
            width={40}
            height={40}
            className={styles.image}
          />
        </div>
    </Link>
  );
};

export default ProfileIcon;