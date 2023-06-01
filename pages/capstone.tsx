
import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import styles from '@/styles/capstone.module.css';
import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import { useState } from "react";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import techOptions from '../app-data/technologies-data.json';
import axios from "axios";
import { useRouter } from 'next/router';
import validator from "validator";


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
    picture: "",
};

interface AppProperties {
    appName: string,
    description: string,
    developers: string[],
    appLink: string,
    videoLink: string,
    github: string,
    type: string,
    technologies: string[],
    picture: string,
}

export default function Capstone ({ allDevs, signedInUser }: {
    allDevs: Developer[],
    signedInUser: Developer
}) {
    const router = useRouter();
    const { data: session } = useSession();
    const [appData, setAppData] = useState<AppProperties>(defaultApp);
    
    const typeOptions: {value: string; label: string}[] = [
        { value: "web", label: "Web" },
        { value: "mobile", label: "Mobile" },
        { value: "game", label: "Game" },
        { value: "social", label: "Social" }
    ];
    const nameOptions = allDevs.map(name => ({ value: String(name.id), label: name.fullName }));

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (validateFormData()) {
            axios.post('/api/appRoutes', {
                ...appData,
                ownerId: signedInUser.id
            })
                .then(function (response) {
                    console.log(response);
                    router.push("/profile");
                })
                .catch(function (error) {
                    console.log(error);
                    alert("Error adding capstone project, please try again");
            })
        }
        else {
            alert("Please fill in all required fields properly");
            // change this to show an error message on page with more details
        }
    }

    const handleChange = (event: any) => {
        let newAppData: AppProperties = { ...appData };
        if (event.label) {
            // event for app type has one option, so it returns {value: "", label: ""}
            // https://stackoverflow.com/questions/71934348/react-event-target-is-undefined-when-trying-to-filter-react-select-options
            newAppData.type = event.value;
        } else {
            // all non-array values for app
            const inputName = event.target.name;
            const targetValue = event.target.value;
            newAppData[inputName as keyof AppProperties] = targetValue;
        } 
        setAppData(newAppData);
    }

    const handleTechnologiesChange = (event: any) => {
        let newAppData = { ...appData };
        const currTechs = event.map((option: { label: any; }) => option.label);
        newAppData.technologies = currTechs;
        setAppData(newAppData);
    }

    const handleDevChange = (event: any) => {
        let newAppData = { ...appData };
        const currDevs: string[] = event.map((option: { value: any; label: any; }) => `${option.value} ${option.label}`);
        newAppData.developers = currDevs;
        setAppData(newAppData);
    }

    const validateFormData = () => {
        if ([appData.appName, appData.developers, appData.type, appData.technologies, appData.description].every((elem) => elem.length <= 0)) {
            console.log("must enter name, description, developers, technologies, and/or type");
            return false
        }
        const links = [appData.github, appData.videoLink, appData.appLink];
        const inputLinks = links.filter(link => link.length > 0);
        if (inputLinks.some((elem) => !validator.isURL(elem))) {
            console.log("Check validity of links");
            return false;
        }
        return true;
    }

    return (
        <div className={styles.appCardWrapper}>
            <div className={styles.createAppImageDrop}>
                <p>Image</p>
            </div>
            <form 
                className={styles.createAppFormsWrapper}
                onSubmit={handleSubmit}>
                    <label className={styles.createAppLabel}>
                        App Name *
                        <input className={styles.createAppInput} type="text" value={appData.appName} onChange={handleChange} name="appName" />
                    </label>
                    <label className={styles.createAppLabel}>
                        Description *
                        <textarea  className={styles.createAppInput} value={appData.description} onChange={handleChange} name="description" />
                    </label>
                    <label className={styles.createAppLabel}>
                        Github Link
                        <input className={styles.createAppInput} type="text" value={appData.github} onChange={handleChange} name="github"/>
                    </label>
                    <label className={styles.createAppLabel}>
                        App Link
                        <input className={styles.createAppInput} type="text" value={appData.appLink} onChange={handleChange} name="appLink"/>
                    </label>
                    <label className={styles.createAppLabel}>
                        Video Demo Link
                        <input className={styles.createAppInput} type="text" value={appData.videoLink} onChange={handleChange} name="videoLink"/>
                    </label>
                    <label>
                        Category *
                        <Select options={typeOptions} onChange={handleChange} instanceId="appType" />
                    </label>
                    <label>
                        Technologies *
                        <CreatableSelect options={techOptions} onChange={handleTechnologiesChange} isMulti isClearable instanceId="appTechnologies" />
                    </label>
                    <label>
                        Developers *
                        <Select options={nameOptions} onChange={handleDevChange} isMulti isClearable instanceId="appDevs" />
                    </label>
                    <input type="submit" value="Submit" className={styles.submitButton}/>
                </form>
        </div>
    )     
}


