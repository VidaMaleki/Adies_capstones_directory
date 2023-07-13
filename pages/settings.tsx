import { useState } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";
import { NextPageContext } from 'next';
import { db } from "@/lib/db";
import { toast } from "react-toastify";
import { DeveloperProps } from '../components/types';

interface AccountStatusResponse {
    isDeleted: boolean;
} 

interface EditDeveloperProps {
    session: any;
    signedInUser: DeveloperProps;
}

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    let userEmail = session?.user?.email ? session.user.email : "";
    console.log(userEmail);
    const signedInUser = await db.developer.findUnique({
        where: {
            email: userEmail,
        },
    });
    
    return {
        props: {
            session,
            signedInUser: signedInUser || {},
        },
    };
}

export default function Settings({ signedInUser }: EditDeveloperProps) {
    const [developerData, setDeveloperData] = useState<DeveloperProps>(signedInUser || {} as DeveloperProps);

    // Add more state variables for other developer fields as needed

    const router = useRouter();

    const handleUpdate = () => {
        // Make API request to update developer information
        axios
        .put(`/api/auth/signup?id=${signedInUser.id}`, {
            id: developerData.id,
            email: developerData.email,
            fullName : developerData.fullName,
            cohort: developerData.cohort,
            linkedin : developerData.linkedin
        })
        .then(function (response) {
            toast.success("Your information was successfully updated");
            // Redirect to the profile page or perform any other desired action
            router.push("/profile");
        })
        .catch(function (error: any) {
            toast.error("Could not update information, try again");
        });
    };

    const handleCancel = () => {
        // Redirect to the profile page or perform any other desired action
        router.push("/profile");
    };

    const handleDelete = () => {
        axios
        .delete(`/api/auth/signup?id=${signedInUser.id}`)
        .then(function (response) {
            toast.success("Your account was successfully deleted")
            // Need to trigger a refresh
            router.push("/");
        })
        .catch(function (error) {
            toast.error("Could not delete your account, please try again")
        });
    }

    const handleAccountStatusCheck = async () => {
        try {
            const response = await fetch("/api/accountStatus");
            const data: AccountStatusResponse = await response.json();
            if (data.isDeleted) {
                toast.success("Your account has been deleted");
                router.push("/");
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    handleAccountStatusCheck();
    

    return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Developer Information</h1>
        <div className="mb-4">
            <label htmlFor="fullName" className="block mb-1 font-medium">
            Full Name
            </label>
            <input
            type="text"
            id="fullName"
            value={developerData.fullName}
            onChange={(e) => setDeveloperData((prevData) => ({
                ...prevData,
                fullName: e.target.value
            }))}
            className="border border-gray-300 rounded-md p-2 w-full"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="cohort" className="block mb-1 font-medium">
            Cohort
            </label>
            <input
            type="cohort"
            id="cohort"
            value={developerData.cohort}
            onChange={(e) => setDeveloperData((prevData) => ({
                ...prevData,
                cohort: e.target.value
            }))}
            className="border border-gray-300 rounded-md p-2 w-full"
            />
        </div>
        <div className="mb-4">
            <label htmlFor="linkedin" className="block mb-1 font-medium">
            LinkedIn
            </label>
            <input
            type="linkedin"
            id="linkedin"
            value={developerData.linkedin}
            onChange={(e) => setDeveloperData((prevData) => ({
                ...prevData,
                linkedin: e.target.value
            }))}
            className="border border-gray-300 rounded-md p-2 w-full"
            />
        </div>
        <div className="flex justify-end">
            <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
            >
            Cancel
            </button>
            <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
            Update
            </button>
        </div>
        <div>
            <button onClick={handleDelete} className="border text-red-500 border-red-500 mt-10 rounded-md p-2 w-full">Delete account</button>
        </div>
        </div>
        
    </div>
    );
}