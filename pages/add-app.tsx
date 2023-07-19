
import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import styles from '@/styles/addApp.module.css';
import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import { useState, ChangeEvent} from "react";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import axios from "axios";
import { useRouter } from 'next/router';
import { AppDataProps } from "@/components/types";
import {typeOptions, techOptions} from '../app-data/selectOptions'
import { z } from 'zod';
import Navbar from "@/components/Navbar/Navbar";


const FormSchema = z.object({
    appName: z.string().nonempty({ message: 'App Name is required' }),
    description: z.string().nonempty({ message: 'Description is required' }),
    developers: z.array(z.object({ fullName: z.string() })).min(1, { message: 'Developers are required' }),
    appLink: z.string().url({ message: 'Invalid App Link URL' }).optional(),
    videoLink: z.string().url({ message: 'Invalid Video Link URL' }).optional(),
    github: z.string().url({ message: 'Invalid Github Link URL' }),
    type: z.string().nonempty({ message: "Category is required." }),
    technologies: z.array(z.string()).min(1, { message: 'Technologies are required' }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export async function getServerSideProps(ctx: NextPageContext) {
    const session = await getSession(ctx);
    const allDevs: Developer[] = await db.developer.findMany();
    // get the signed in (if signed in) dev here, add as prop
    // current work around to not get error when querying db by user email
    let userEmail = session?.user?.email ? session.user.email : "";
    const signedInUser = await db.developer.findUnique({
        where: {
            email: userEmail,
        },
    })

    return {
        props:{
            session,
            allDevs,
            signedInUser
        }
    }
}

const defaultApp: FormSchemaType = {
    appName: "",
    description: "",
    developers: [],
    appLink: "",
    videoLink: "",
    github: "",
    type: "",
    technologies: [],
};

export default function Capstone ({ allDevs, signedInUser }: {
    allDevs: Developer[],
    signedInUser: Developer
}) {
    
    const router = useRouter();
    const { data: session } = useSession();
    const [appData, setAppData] = useState<FormSchemaType>(defaultApp);
    // const [appImage, setAppImage] = useState<File | string>("");
    console.log(appData)
    
    const nameOptions = allDevs.map(name => ({ value: String(name.id), label: name.fullName }));

    const handleChange = (event: any) => {
        let newAppData: FormSchemaType = { ...appData };
        if (event.label) {
            // event for app type has one option, so it returns {value: "", label: ""}
            // https://stackoverflow.com/questions/71934348/react-event-target-is-undefined-when-trying-to-filter-react-select-options
            newAppData.type = event.label; 
        } else {
            // all non-array values for app
            const inputName = event.target.name;
            const targetValue = event.target.value;
            newAppData[inputName as keyof AppDataProps] = targetValue;
        } 
        console.log(typeof event.label);
        console.log(newAppData)
        setAppData(newAppData);
    }

    const handleTechnologiesChange = (event: any) => {
        let newAppData: FormSchemaType = { ...appData };
        const currTechs = event.map((option: { label: any; }) => option.label);
        newAppData.technologies = currTechs;
        setAppData(newAppData);
        
    }

    const handleDevChange = (event: any) => {
        let newAppData: FormSchemaType = { ...appData };
        const currDevs: { fullName: string }[]= event.map((option: { value: string; label: string }) => 
        ({ fullName: option.label }));
        newAppData.developers = currDevs
        setAppData(newAppData);
    };

    const validateFormData = () => {
        const validationResult = FormSchema.safeParse(appData);
    
        if (!validationResult.success) {
            const errorMessages = validationResult.error.errors.map((error) => error.message);
            console.log("Validation Error:", errorMessages);
            return false;
        }
        console.log("Validation Result:", validationResult.data);
        return true;
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        
        if (validateFormData()) {
            console.log(appData)
            axios
            .post("/api/appRoutes/", appData, {
                // headers: {
                // "Content-Type": "multipart/form-data",
                // },
            })
            .then(function (response) {
                console.log(response);
                router.push("/profile");
            })
            .catch(function (error) {
                console.log(error);
                alert("Error adding capstone project, please try again");
            });
        } else {
            alert("Please fill in all required fields properly");
        }
    };
    
    return (
    <div className="bg-gray-100 min-h-screen">
        <Navbar />
        <div className="flex-grow mx-auto pt-20 px-4 py-8 max-w-xl">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label className="block mb-2 font-medium" htmlFor="appName">
            App Name *
            </label>
            <input
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            type="text"
            value={appData.appName}
            onChange={handleChange}
            name="appName"
            id="appName"
            />
            <label className="block mb-2 font-medium" htmlFor="description">
            Description *
            </label>
            <textarea
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            value={appData.description}
            onChange={handleChange}
            name="description"
            id="description"
            ></textarea>
            <label className="block mb-2 font-medium" htmlFor="github">
            Github Link
            </label>
            <input
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            type="text"
            value={appData.github}
            onChange={handleChange}
            name="github"
            id="github"
            />
            <label className="block mb-2 font-medium" htmlFor="appLink">
            App Link
            </label>
            <input
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            type="text"
            value={appData.appLink}
            onChange={handleChange}
            name="appLink"
            id="appLink"
            />
            <label className="block mb-2 font-medium" htmlFor="videoLink">
            Video Demo Link
            </label>
            <input
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
            type="text"
            value={appData.videoLink}
            onChange={handleChange}
            name="videoLink"
            id="videoLink"
            />
            <label className="block mb-2 font-medium" htmlFor="type">
            Category *
            </label>
            <Select options={typeOptions} onChange={handleChange} instanceId="appType" className="mb-4" />
            <label className="block mb-2 font-medium" htmlFor="technologies">
            Technologies *
            </label>
            <CreatableSelect
            options={techOptions}
            onChange={handleTechnologiesChange}
            isMulti
            isClearable
            instanceId="appTechnologies"
            className="mb-4"
            />
            <label className="block mb-2 font-medium" htmlFor="developers">
            Developers *
            </label>
            <Select options={nameOptions} onChange={handleDevChange} isMulti isClearable instanceId="appDevs" className="mb-4" />
            <input type="submit" value="Submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" />
        </form>
        </div>
    </div>
    );
}