import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import Link from "next/link";
import { db } from "@/lib/db";
import axios from "axios";
import { Developer } from "@prisma/client";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import { FaSave } from "react-icons/fa";
import { useEffect, useState } from "react";
import { AppWithIdProps, DeveloperWithAppProps } from "@/components/types";

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    let userEmail = session?.user?.email ? session.user.email : "";

    const signedInUser = await db.developer.findUnique({
        where: {
        email: userEmail,
        },
        include: {
        // Associated apps for the developer
        app: true,
        },
    });

    return {
        props: {
        session,
        signedInUser: signedInUser || {},
        },
    };
}

export default function EditApp({ signedInUser }: { signedInUser: DeveloperWithAppProps }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [appData, setAppData] = useState<AppWithIdProps>(signedInUser.app || {} as AppWithIdProps);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        appData.developers = [signedInUser];
        axios
        .put(`/api/appRoutes?id=${appData.id}`, appData)
        .then(function (response) {
            console.log(response);
            alert("Your app was successfully updated");
            // Need to trigger a refresh
            router.reload();
        })
        .catch(function (error) {
            console.log(error);
            alert("Could not update app, try again");
            setIsSaving(false);
        });
    };

    useEffect(() => {
        // Redirect to home page if user is not authenticated
        if (!session) {
        router.push("/");
        }
    }, [session, router]);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    // If session is not available, the redirect will happen on the client side
    if (!session) {
        return null;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setAppData((prevAppData) => ({ ...prevAppData, [name]: value }));
    };

    return (
        <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit App</h1>
            <form>
            <div className="mb-6">
                <label htmlFor="appName" className="block text-gray-700 font-bold mb-2">
                App Name
                </label>
                <input
                type="text"
                id="appName"
                name="appName"
                value={appData.appName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                Description
                </label>
                <textarea
                id="description"
                name="description"
                value={appData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={5}
                required
                />
            </div>
            <div className="flex justify-end">
                <button
                type="submit"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                {isSaving ? "Saving..." : "Save"}
                </button>
            </div>
            </form>
        </div>
        </div>
    );
}





