import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import Link from "next/link";
import { db } from "@/lib/db";
import axios from "axios";
import AppCard from "@/components/AppCard";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import styles from "@/styles/About.module.css";
import { useEffect } from "react";
import { AppWithIdProps, DeveloperWithAppProps} from "@/components/types";
import Image from "next/image";
import App from "next/app";
import { Developer } from "@prisma/client";


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

export default function Profile({ signedInUser}: {signedInUser: Developer & { app: AppWithIdProps }}) {
    const { data: session, status } = useSession();
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
            <div className="mx-auto w-2/5 mt-40 mb-20">
                <div className="border border-gray-300 relative flex flex-col w-full rounded-lg">
                    <div className="flex flex-col justify-center items-center"></div>
                    <div className="w-full text-center p-4 bg-gray-100 rounded-t-lg">
                        <div className="relative">
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
        </div>
    );
}

// <div className="text-center mt-12">
//                 <h3 className="text-4xl font-semibold mb-2">
//                     {session?.user?.name}
//                 </h3>
//                 <div className="text-sm mb-2 font-bold">
//                     {session?.user?.email}
//                 </div>
//                 {/* <div className="mb-2 mt-10">
//                                 You logged in using &nbsp; 
//                                 <span
//                                 className="capitalize bg-blue-400 text-white px-4 py-1 ml-2 font-bold italix text-lg rounded-md"
//                                 >
//                                 {session?.user?.provider}
//                                 </span>
//                             </div> */}
//             </div>
//                 <div className="mt-10 py-10 border-t text-center">
//                 <div className="flex flex-wrap justify-center">
//                     <div className="w-full px-4">
//                     <p className="mb-4 text-sm">
//                         {text1}
//                     </p>
//                     <p className="font-bold text-xs">
//                         {text2}
//                     </p>
//                     <br></br>
//                 </div>
//                 </div>
//                 <div className="flex flex-col  justify-center items-center">
//                     {signedInUser.app && (
//                     <div className="w-full mb-8 flex items-center justify-around ">
//                         <h4>Your capstone project</h4>
//                         <div className="w-1/4 flex justify-between items-center  ">
//                         {signedInUser.app && (
//                             <div className="w-50 flex justify-center items-center font-bold cursor-pointer ">
//                             <a onClick={handleDelete}>
//                                 <FaTrashAlt />
//                             </a>
//                             </div>
//                         )}
//                         {signedInUser.app && (
//                             <div className="w-50 flex justify-center items-center font-bold cursor-pointer">
//                             <a onClick={() => alert("Need to add edit function")}>
//                                 <FaEdit />
//                             </a>
//                             </div>
//                         )}
//                         </div>
//                     </div>
//                     )}
//                     {!signedInUser.app && (
//                     <div className="w-full bg-sky-500/100 w-2/4 flex justify-center items-center border border-gray font-bold rounded-lg mt-5 px-8 py-2">
//                         <Link href={`/capstone/`}>Add Your app</Link>
//                     </div>
//                 )}
//                     {signedInUser.appId && <AppCard app={signedInUser.app} />}
//                 </div>
//                 </div>
//             </div>
//             </div>
//         </div>
//         </div>
//     );
// }