
import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Image from "next/image";
// import { AiFillGithub } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import Link from "next/link";
// import { Session } from "@auth0/nextjs-auth0";
import { db } from "@/lib/db";
import axios from "axios";
import { App, Developer } from "@prisma/client";
import AppCard from "@/components/AppCard";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import styles from "@/styles/About.module.css";
import { useEffect } from "react";


interface AppData {
    id: number;
    appName: string;
    description: string;
    developers: string[];
    appLink: string;
    videoLink: string;
    github: string;
    type: string;
    technologies: string[];
    picture: string;
}

// Update the Developer interface to include the app property
interface DeveloperWithApp extends Developer {
    app?: AppData;
}


export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    let userEmail = session?.user?.email ? session.user.email : "";
    
    const signedInUser = await db.developer.findUnique({
        where: {
        email: userEmail,
        },
        include: {
            app: true, // Include the associated apps for the developer
            },
        });
        
        return {
            props:{
                session,
                signedInUser
        }
    }
}

export default function Profile({ signedInUser }: {
    signedInUser: Developer & { app: App }
}) {
    const { data: session , status} = useSession()
  // console.log(session);
    const text1: string = "After adding your app, you can view it below"
    const text2: string = "* Note: For adding all developers they need to have account"
    const router = useRouter();

    const handleDelete = () => {
        axios
        .delete(`/api/appRoutes?id=${signedInUser.id}`)
        .then(function (response) {
            console.log(response);
            alert("Your app was successfully deleted");
            // Need to trigger a refresh
            router.reload();
        })
        .catch(function (error) {
            console.log(error);
            alert("Could not delete app, try again");
        });
    };

    useEffect(() => {
        // Redirect to home page if user is not authenticated
        if (!session) {
        router.push("/");
        }
    }, [session, router]);

    const handleSignOut = async () => {
        await signOut();
    router.push("/");
    };

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // If session is not available, the redirect will happen on the client side
    if (!session) {
        return null;
    }

    return (
        <div className={styles.pageWrapper}>
        <Navbar />
        <div className="mx-auto w-2/5 mt-20 mb-20">
            <div className=" border border-gray-300 relative flex flex-col w-full rounded-lg">
            <div className="flex flex-col justify-center items-center">
                <div className="w-full text-right">
                <div className="flex justify-end items-center text-3xl py-6 px-3">
                    <a
                    className="font-bold px-8 py-2 rounded-md sm:mr-2 mb-1 ease-linear transition-all cursor-pointer duration-150"
                    onClick={handleSignOut}
                    >
                    <BiLogOut />
                    </a>
                </div>
                </div>
                <div className="w-full flex justify-center">
                <Image
                    src={session?.user?.image!}
                    alt={`${session?.user?.name} image`}
                    width={40}
                    height={40}
                    className="rounded-full w-40 h-40 "
                />
                </div>
                <div className="text-center mt-12">
                <h3 className="text-4xl font-semibold mb-2">
                    {session?.user?.name}
                </h3>
                <div className="text-sm mb-2 font-bold">
                    {session?.user?.email}
                </div>
                {/* <div className="mb-2 mt-10">
                                You logged in using &nbsp; 
                                <span
                                className="capitalize bg-blue-400 text-white px-4 py-1 ml-2 font-bold italix text-lg rounded-md"
                                >
                                {session?.user?.provider}
                                </span>
                            </div> */}
            </div>
                <div className="mt-10 py-10 border-t text-center">
                <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4">
                    <p className="mb-4 text-sm">
                        {text1}
                    </p>
                    <p className="font-bold text-xs">
                        {text2}
                    </p>
                    <br></br>
                </div>
                </div>
                <div className="flex flex-col  justify-center items-center">
                    {signedInUser.app && (
                    <div className="w-full mb-8 flex items-center justify-around ">
                        <h4>Your capstone project</h4>
                        <div className="w-1/4 flex justify-between items-center  ">
                        {signedInUser.app && (
                            <div className="w-50 flex justify-center items-center font-bold cursor-pointer ">
                            <a onClick={handleDelete}>
                                <FaTrashAlt />
                            </a>
                            </div>
                        )}
                        {signedInUser.app && (
                            <div className="w-50 flex justify-center items-center font-bold cursor-pointer">
                            <a onClick={() => alert("Need to add edit function")}>
                                <FaEdit />
                            </a>
                            </div>
                        )}
                        </div>
                    </div>
                    )}
                    {!signedInUser.app && (
                    <div className="w-full bg-sky-500/100 w-2/4 flex justify-center items-center border border-gray font-bold rounded-lg mt-5 px-8 py-2">
                        <Link href={`/capstone/`}>Add Your app</Link>
                    </div>
                )}
                    {signedInUser.appId && <AppCard app={signedInUser.app} />}
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}