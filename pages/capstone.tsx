
import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Image from "next/image";
// import { AiFillGithub } from "react-icons/ai";
// import Link from "next/link";
import styles from '@/styles/capstone.module.css'

export default function Capstone () {
    const { data: session } = useSession()
    
    return (
    <div className={styles.appCardWrapper}>
        <h2>Capstone app</h2>
        <div className={styles.appCardImage}>
            <Image
            src={session?.user?.image!} 
            alt={`${session?.user?.name} image`}
            width={40}
            height={40}
            className="rounded-full w-40 h-40 "/>
        </div>
    </div>
    )     
}

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    return {
        props:{
            session,
        }
    }
}
