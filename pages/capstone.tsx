
import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Image from "next/image";
// import { AiFillGithub } from "react-icons/ai";
// import Link from "next/link";
import styles from '@/styles/capstone.module.css';
import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import { useState } from "react";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import techOptions from '../app-data/technologies-data.json';
import axios from "axios";

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

const defaultApp = {
    appName: "",
    description: "",
    developers: [],
    appLink: "",
    videoLink: "",
    github: "",
    type: "",
    technologies: [],
    // ownerId: null,
    picture: "",
    // owner: null
};
// let defaultApp : {
//     appName: string,
//     description: string,
//     developers: string[],
//     appLink?: string,
//     videoLink?: string,
//     github?: string,
//     type: string,
//     technologies: string[],
//     ownerId: number,
//     picture?: string,
//     owner: Developer
// };
interface AppProperties {
    appName: string,
    description: string,
    developers: string[],
    appLink: string,
    videoLink: string,
    github: string,
    type: string,
    technologies: string[],
    // ownerId: number,
    picture: string,
    // owner: Developer
}

export default function Capstone ({ allDevs, signedInUser }: {
    allDevs: Developer[],
    signedInUser: Developer
}) {

    const { data: session } = useSession();
    // const isSignedIn = session?.user?.email;
    // console.log(isSignedIn); // currently says null, even though I am signed in?
    const [appData, setAppData] = useState<AppProperties>(defaultApp);
    
    const typeOptions: {value: string; label: string}[] = [
        { value: "web", label: "Web" },
        { value: "mobile", label: "Mobile" },
        { value: "game", label: "Game" },
        { value: "social", label: "Social" }
    ];

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        // axios.post('/user', {
        //     firstName: 'Fred',
        //     lastName: 'Flintstone'
        // })
        // .then(function (response) {
        //     console.log(response);
        // })
        // .catch(function (error) {
        //     console.log(error);
        // });
        
        // const response = await fetch('/api/appRoutes', {
        //     method: "POST",
        //     body: JSON.stringify({...appData, ownerId: signedInUser.id}),
        // });
        // if (response.status === 201) {
        //     alert(`You successfully added your capstone project`);
        // } else {
        //     alert("Error adding capstone project, please try again");
        // }
        axios.post('/api/appRoutes', {
            ...appData,
            ownerId: signedInUser.id
        })
            .then(function (response) {
                console.log(response);
                alert("You successfully added your capstone project")
            })
            .catch(function (error) {
                console.log(error);
                alert("Error adding capstone project, please try again");
        })
    }

    const handleChange = (event: any) => {
        // console.log(event);
        let newAppData: AppProperties = { ...appData };
        // this is why value prop isn't needed
        if (event.label) {
            // type has one option, so it returns {value: "", label: ""}
            // https://stackoverflow.com/questions/71934348/react-event-target-is-undefined-when-trying-to-filter-react-select-options
            newAppData.type = event.value;
        } else {
            const inputName: string = event.target.name;
            const targetValue = event.target.value;
            // newAppData[inputName as keyof AppProperties] = targetValue;
            newAppData[inputName as keyof AppProperties] = targetValue;
        } 
        setAppData(newAppData);
        // console.log(appData);
    }

    const convertDeveloperNames = (names: Developer[]) => {
        const nameOptions = [];
        for (let dev of names) {
            const newLabel = dev.fullName;
            // const newValue = dev.fullName.toLowerCase().replace(/\s/g, '');
            // names might not be unique, so use id as string as value
            nameOptions.push({ value: String(dev.id), label: newLabel });
        }
        return nameOptions
    }
    const nameOptions = convertDeveloperNames(allDevs);

    const handleTechnologiesChange = (event: any) => {
        // console.log(event);
        let newAppData = { ...appData };
        // technologies has more than one option, returns a list [{value: "", label: ""}, ...]
        const currTechs = [];
        for (let option of event) {
            currTechs.push(option.label);
        }
        newAppData.technologies = currTechs;
        setAppData(newAppData);
    }

    const handleDevChange = (event: any) => {
        let newAppData = { ...appData };
        const currDevs: string[] = [];
        for (let option of event) {
            console.log(typeof option.value)
            currDevs.push(option.value);
        }
        newAppData.developers = currDevs;
        setAppData(newAppData);
    }
    return (
    <div className={styles.appCardWrapper}>
        <h2>Capstone app</h2>
        <form onSubmit={handleSubmit}>
                <label>
                    App Name
                    <input type="text" value={appData.appName} onChange={handleChange} name="appName" />
                </label>
                <label>
                    Description
                    <textarea value={appData.description} onChange={handleChange} name="description" />
                </label>
                <label>
                    Github Link
                    <input type="text" value={appData.github} onChange={handleChange} name="github"/>
                </label>
                <label>
                    App Link
                    <input type="text" value={appData.appLink} onChange={handleChange} name="appLink"/>
                </label>
                <label>
                    Video Demo Link
                    <input type="text" value={appData.videoLink} onChange={handleChange} name="videoLink"/>
                </label>
                <label>
                    Category
                    <Select options={typeOptions} onChange={handleChange} instanceId="appType" />
                </label>
                <label>
                    Technologies
                    <CreatableSelect options={techOptions} onChange={handleTechnologiesChange} isMulti isClearable instanceId="appTechnologies" />
                </label>
                <label>
                    Developers
                    <CreatableSelect options={nameOptions} onChange={handleDevChange} isMulti isClearable instanceId="appDevs" />
                </label>
                <input type="submit" value="Submit" />
            </form>
    </div>
    )     
}


