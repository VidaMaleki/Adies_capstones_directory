import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import styles from "@/styles/Profile.module.css";
import axios from "axios";
import { DeveloperProps } from "../types";

interface AccountStatusResponse {
  isDeleted: boolean;
}

const ProfileIcon = (): JSX.Element | null => {
  const dev_url = `${process.env.NEXT_PUBLIC_DEV_URL}`;
  const account_status = `${process.env.NEXT_PUBLIC_STATUS}`;
  const { data: session } = useSession();
  const [isDeleted, setIsDeleted] = useState(false);
  const [developer, setDeveloper] = useState<DeveloperProps | null>(null);

  const getDeveloper = async () => {
    try {
      const response = await axios.get(dev_url);
      const developers: DeveloperProps[] = response.data;
      const matchingDeveloper = developers.find(
        (developer) => developer.email === session?.user?.email
      );

      if (matchingDeveloper) {
        setDeveloper(matchingDeveloper);
      } else {
        console.error("Developer not found for the current user.");
      }
    } catch (error) {
      console.error("Error fetching developer data: ", error);
    }
  };

  useEffect(() => {
    const fetchAccountStatus = async () => {
      if (session) {
        try {
          const response = await fetch(account_status);
          const data: AccountStatusResponse = await response.json();
          setIsDeleted(data.isDeleted);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchAccountStatus();
    if (session) {
      getDeveloper();
    }
  }, [session]);

  if (!session || isDeleted) {
    return null;
  }
  return (
    <Link href="/profile">
      <div className={styles.imageWrapper}>
        <Image
          src={
            developer?.image
              ? `/profile-pictures/${developer?.image}.png`
              : `/profile-pictures/45.png`
          }
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
