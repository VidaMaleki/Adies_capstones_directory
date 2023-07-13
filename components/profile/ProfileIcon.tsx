import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "@/styles/Profile.module.css";

interface AccountStatusResponse {
  isDeleted: boolean;
}

const ProfileIcon = (): JSX.Element | null => {
  const { data: session } = useSession();
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const fetchAccountStatus = async () => {
      if (session) {
        try {
          const response = await fetch("/api/accountStatus");
          const data: AccountStatusResponse = await response.json();
          setIsDeleted(data.isDeleted);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchAccountStatus();
  }, [session]);

  if (!session || isDeleted) {
    return null;
  }

  return (
    <Link href="/profile">
      <div className={styles.imageWrapper}>
        <Image
          src={session.user?.image!}
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