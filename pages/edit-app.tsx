import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import Select, { ActionMeta, MultiValue } from 'react-select';
import {typeOptions, techOptions} from '../app-data/selectOptions'
import { db } from "@/lib/db";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { AppWithIdProps, DeveloperWithAppProps } from "@/components/types";
import CreatableSelect from 'react-select/creatable';
import { Developer} from "@prisma/client";
import { z } from 'zod';
import { toast } from "react-toastify";



const FormSchema = z.object({
    appName: z.string().nonempty({ message: 'App Name is required' }),
    id: z.string(),
    description: z.string().nonempty({ message: 'Description is required' }),
    developers: z.array(z.object({
        fullName: z.string(),
        id: z.number()})).min(1, { message: 'Developers are required' }),
    appLink: z.string().url({ message: 'Invalid App Link URL' }).optional(),
    videoLink: z.string().url({ message: 'Invalid Video Link URL' }).optional(),
    github: z.string().url({ message: 'Invalid Github Link URL' }),
    type: z.string().nonempty({ message: "Category is required." }),
    technologies: z.array(z.string()).min(1, { message: 'Technologies are required' }),
});

export type FormSchemaType = z.infer<typeof FormSchema>;
interface EditAppProps {
    signedInUser: Developer;
    allDevs : Developer[];
    app: AppWithIdProps; 
}

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    let userEmail = session?.user?.email ? session.user.email : "";

    const signedInUser = await db.developer.findUnique({
        where: {
        email: userEmail,
        },
        include: {
            app : true,
        },
    });
    
    const app = await db.app.findUnique({
        where: {
            id: signedInUser?.appId || 0
        },
        include: {
            developers : true,
        },
    })

    const allDevs: Developer[] = await db.developer.findMany({
        where: {
            appId: {in: [0, signedInUser?.appId || 0]}
        }    
        });
    return {
        props: {
        session,
        allDevs,
        signedInUser: signedInUser || {},
        app,
        },
    };
};
const convertAppToFormSchema  = (app: AppWithIdProps): FormSchemaType => {
    return {
        appName: app.appName,
        id: app.id.toString(),
        description: app.description,
        developers: app.developers,
        appLink:app.appLink || "",
        videoLink: app.videoLink || "",
        github: app.github,
        type: app.type,
        technologies: app.technologies,
    };

}

export default function EditApp({ signedInUser, allDevs, app }: EditAppProps ) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [appData, setAppData] = useState<FormSchemaType>(convertAppToFormSchema(app) );
    const [isSaving, setIsSaving] = useState(false);
    const nameOptions = allDevs.map(name => ({ value: String(name.id), label: name.fullName }));

    const handleCancel = (event : any ) => {
        event.preventDefault()
        router.push("/profile")
    };

    const handleSave = (event: any) => {
        event.preventDefault()
        setIsSaving(true);
        axios
        .put(`/api/appRoutes?id=${appData.id}`, appData)
        .then(function (response) {
            console.log(response);
            toast.success("Your app information was successfully updated");
            // Need to trigger a refresh
            router.push("/profile");
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

    const handleChange = (event: any)=>{
        let newAppData : FormSchemaType = {...appData};
        if (event.label) {
            newAppData.type = event.label; 
        }
        else {
            const inputName : string = event.target.name;
            const targetValue = event.target.value;
            newAppData[ inputName as keyof FormSchemaType] = targetValue;
        }
        setAppData( newAppData );
    };

    const handleDevChange = (event: any) => {
        console.log("event", event);
        const newAppData = { ...appData };
        const currDevs: Developer[]= event.map((option: { value: string; label: string }) => 
        {
            const devId = option.value;
            const filteredDev = allDevs.find(devData => devData.id.toString() === devId);
            return filteredDev;
        });

        newAppData.developers = currDevs
        setAppData(newAppData);
    };


    const handleTechnologiesleChange = (newValue: MultiValue<{ label: string; value: string; }>, actionMeta: ActionMeta<{ label: string; value: string; }>) => {
        const currTechs = newValue.map((option: { label: any; }) => option.label);
        const newAppData = {...appData};
        newAppData.technologies = currTechs;
        setAppData(newAppData);
    };

    

    const findSelectedTechnologies = (techOptions: {value: string; label: string} [], selectedTechnologies: string []) =>{
        const selectedTechOptions = [];
        const setSelectedTechnologies = new Set(selectedTechnologies);
        for (let option of techOptions){
            if (setSelectedTechnologies.has(option.label)){
                selectedTechOptions.push(option);
            }
        }
        console.log(selectedTechnologies, "options", selectedTechOptions)
        return selectedTechOptions;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 pt-20">
            <h1 className="text-3xl font-bold mb-6">Edit App</h1>
            <form onSubmit={handleSave}>
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
            <div className="mb-6">
                <label htmlFor="github" className="block text-gray-700 font-bold mb-2">
                GitHub
                </label>
                <input
                type = "text"
                id="github"
                name="github"
                value={appData.github}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="appLink" className="block text-gray-700 font-bold mb-2">
                App Link
                </label>
                <input
                type = "text"
                id="appLink"
                name="appLink"
                value={appData.appLink} 
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="videoLink" className="block text-gray-700 font-bold mb-2">
                Video Link
                </label>
                <input
                type = "text"
                id="videoLink"
                name="videoLink"
                value={appData.videoLink}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="appType" className="block text-gray-700 font-bold mb-2">
                Category
                <Select 
                options={typeOptions} 
                value={typeOptions.find(c => c.label === appData.type)} 
                onChange={handleChange} 
                instanceId="appType" 
                className="mb-4" 
                required/>
                </label>
            </div>
            <div className="mb-6">
                <label htmlFor="technologies" className="block text-gray-700 font-bold mb-2">
                Technologies
                <CreatableSelect 
                options={techOptions} 
                value={findSelectedTechnologies(techOptions, appData.technologies)}
                onChange={handleTechnologiesleChange} 
                isMulti 
                isClearable 
                instanceId="technologies" 
                className="mb-4" 
                required/>
                </label>
            </div>
            <div className="mb-6">
                <label className="block mb-2 font-medium" htmlFor="developers">
                Developers
                </label>
                <CreatableSelect 
                options={nameOptions} 
                value = {appData.developers.map((developer:{fullName: string, id: number} ) => {return {label: developer?.fullName, value: developer?.id.toString()}})} 
                onChange={handleDevChange} 
                isMulti 
                isClearable 
                instanceId="appDevs" 
                className="mb-4" />
            </div>
            <div className="flex justify-end">
                <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                Cancel
                </button>  
                <button
                type="submit"
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