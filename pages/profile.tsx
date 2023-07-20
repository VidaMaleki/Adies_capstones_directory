import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import {AiFillSetting} from "react-icons/ai";
import Link from "next/link";
import { db } from "@/lib/db";
import axios from "axios";
import AppCard from "@/components/AppCard";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import styles from "@/styles/About.module.css";
import { useEffect, useState } from 'react';
import Image from "next/image";
import { Developer } from "@prisma/client";
import { AppWithDevelopersProps, DeveloperWithAppProps } from '../components/types';
import Settings from "@/components/Settings";


export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    let userEmail = session?.user?.email ? session.user.email : "";
    
    const signedInUser = await db.developer.findUnique({
        where: {
            email: userEmail,
        },
        include: {
            // Associated apps for the developer
            app: {
            include: {
                developers: true,
            },
            },
        },
        });
    
        return {
        props:{
            session,
            signedInUser
        }
    };
}

export default function Profile({ signedInUser}: {signedInUser: DeveloperWithAppProps & { app: AppWithDevelopersProps}}) {
    
    const { data: session, status } = useSession();
    const [showSettings, setShowSettings] = useState(false);
    const router = useRouter();

    const handleDelete = () => {
        axios
        .delete(`/api/appRoutes?id=${signedInUser.appId}`)
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

    const handleOpenSetting = () => {
        setShowSettings(true);
    };

    const onClose= () => {
        setShowSettings(false);
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
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="mx-auto w-2/5 pt-40 mb-20">
                <div className="border border-gray-300 relative flex flex-col w-full rounded-lg">
                    <div className="flex flex-col justify-center items-center"></div>
                    <div className="w-full text-center p-4 bg-gray-100 rounded-t-lg">
                        <div className="relative">
                            <button onClick={handleOpenSetting}
                                className="absolute top-0 left-0 mt-2 mr-2 text-gray-500"  
                            >
                                <AiFillSetting size={24} />
                            </button>
                            <h2 className="text-2xl font-bold">My Profile</h2>
                            <button
                                className="absolute top-0 right-0 mt-2 mr-2 text-gray-500"
                                onClick={handleSignOut}
                            >
                                <BiLogOut size={24} />
                            </button>
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
                    <p className="text-gray-600">
                        Welcome, {signedInUser.fullName}! Here are your app details:
                    </p>
                    </div>
                    <div className="p-4">
                    {signedInUser.app ? (
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="flex justify-center gap-10">
                                <Link href="/edit-app" className="flex justify-center items-center">
                                    <FaEdit className="mr-2" />Edit
                                </Link>
                                <button
                                    className="flex items-center text-red-600"
                                    onClick={handleDelete}
                                >
                                    <FaTrashAlt className="mr-2" />Delete
                                </button>
                            </div>
                            <div className="flex justify-center items-center">
                            {signedInUser.appId && <AppCard app={signedInUser.app} />}
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-600">
                            You have not added any apps yet. Click the button below to add an app.
                            <p className="mt-6">*Note: If you have group project, you can add only developers that already created account.</p>
                        </div>
                    )}
                    {!signedInUser.app && ( // Render the button only if app is not present
                        <div className="w-full flex justify-center items-center">
                            <Link href={`/add-app`} className="bg-blue-500 text-white px-4 py-2 rounded mt-4">
                                Add App
                            </Link>
                        </div>
                        )}
                    </div>
                </div>
            </div>
            {showSettings && (
        <Settings signedInUser={signedInUser} onClose={onClose} />
            )}        
        </div>
    );
}

