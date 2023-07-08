// import React, { useState, ChangeEvent, FormEvent } from 'react';
// import { AppDataProps } from "./types";
// import axios from "axios";
// import { NextPageContext } from 'next';
// import { getSession } from 'next-auth/react';
// import { Developer } from '@prisma/client';
// import { db } from '@/lib/db';
// import { options }from '../app-data/techOptions'
// import { MultiSelect } from "react-multi-select-component";
// import {CustomSelect, SelectOption } from './CustomSelect';
// // import "react-multi-select-component/dist/esm/react-multi-select-component.css";


// export async function getServerSideProps(ctx: NextPageContext) {
//     const session = await getSession(ctx);
//     const allDevs: Developer[] = await db.developer.findMany();
//     // get the signed in (if signed in) dev here, add as prop
//     // current work around to not get error when querying db by user email
//     let userEmail = session?.user?.email ? session.user.email : "";
//     const signedInUser = await db.developer.findUnique({
//         where: {
//             email: userEmail,
//         },
//     })

//     return {
//         props:{
//             session,
//             allDevs,
//             signedInUser
//         }
//     }
// }
// type Option = {
//     value: string;
//     label: string;
// };
// type CreateAppProps = {
//     onAddApp: (appData: AppDataProps) => void;
// };

// // type CapstoneProps = {
// //     signedInUser: DeveloperWithApp;
// // };

// const defaultApp: AppDataProps = {
//     id: 0,
//     appName: "",
//     description: "",
//     developers: [],
//     appLink: "",
//     videoLink: "",
//     github: "",
//     type: "",
//     technologies: [],
//     picture: "",
// };


// export default function CreateApp({ allDevs = [], signedInUser, onAddApp }: {
//     allDevs?: Developer[],
//     signedInUser: Developer,
//     onAddApp: (appData: AppDataProps) => void;
// }) {

//     const [appImage, setAppImage] = useState<File | null>(null);
//     const [appData, setAppData] = useState<AppDataProps>(defaultApp);
//     const [selectedCategory, setSelectedCategory] = useState("");    
//     const categoryOptions: string[] = ["Web", "Mobile", "Game", "Social"];
//     const [value, setValue] = useState<SelectOption[]>();
//     // const nameOptions = allDevs.map(name => ({ value: String(name.id), label: name.fullName }));
//     const submitApp = (event: FormEvent) => {
//         event.preventDefault();
    
//         // Create an object with the form data
//         const formData = {
//             ...appData, appImage
//         };
//         console.log("Here is Submit app")
        
//         // Send the form data to the server
//         axios.post("/api/appRoutes", formData)
//         .then(function (response) {
//             console.log(response);
//             alert("App created successfully");
//             // I am Calling the onAddApp callback to add the app data to the profile
//             onAddApp(appData);
//             // Reset the form fields after successful submission
//             setAppData(defaultApp);
//             setAppImage(null);
//         })
//         .catch(function (error) {
//             console.log(error);
//             alert("Failed to create app. Please try again.");
//         });
//     };

//     const handleAppDataChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//         const { id, value } = event.target;
//         console.log(id, value)
//         switch (id) {
//             case 'developers':
//             case 'technologies':
//             setAppData((prevState) => ({
//                 ...prevState,
//                 [id]: value.split(',').map((item) => item.trim()),
//             }));
//             break;
//             case 'appLink':
//             case 'videoLink':
//             case 'github':
//             setAppData((prevState) => ({
//                 ...prevState,
//                 [id]: value.trim(),
//             }));
//             break;
//             default:
//             setAppData((prevState) => ({
//                 ...prevState,
//                 [id]: value,
//             }));
//         }
//     };

//     const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
//         console.log(event.target)
//         const { value } = event.target;
//         setSelectedCategory(value);
//     };
//     // const handleSelectChange = (selectedTech: Option[]) => {
//     //     setSelectedTech(selectedTech as Option[]);
//     // };
    
//     // const handleDevChange = (event: any) => {
//     //     let newAppData = { ...appData };
//     //     const currDevs: string[] = event.map((option: { value: any; label: any; }) => `${option.value} ${option.label}`);
//     //     newAppData.developers = currDevs;
//     //     setAppData(newAppData);
//     // }

//     const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0];
//         console.log(file)
//         if (file) {
//         setAppImage(file);
//         }
//     };

//     return (
//         <div className="flex justify-center ">
//         <div className="w-full max-w-xl">
//             <div className="bg-white rounded-lg shadow">
//             <div className="w-full text-center p-4 bg-gray-100 rounded-t-lg">
//                 <h2 className="text-2xl font-bold">Add App</h2>
//             </div>
//             <form className="p-4" onSubmit={submitApp}>
//                 <div className="mb-4">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="appName">
//                     App Name *
//                 </label>
//                 <input
//                     className="w-full p-2 border border-gray-300 rounded"
//                     type="text"
//                     id="appName"
//                     value={appData.appName}
//                     onChange={handleAppDataChange}
//                 />
//                 </div>
//                 <div className="mb-4">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="appDescription">
//                     App Description *
//                 </label>
//                 <textarea
//                     className="w-full p-2 border border-gray-300 rounded"
//                     id="description"
//                     value={appData.description}
//                     onChange={handleAppDataChange}
//                 ></textarea>
//                 </div>
//                 <div className="mb-4">
//                     {/* <label>
//                     Developers *
//                     <Select options={nameOptions} onChange={handleDevChange} isMulti isClearable instanceId="appDevs" />

//                     </label> */}

//                 </div>
//                 <div className="mb-4">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="appLink">
//                     App Link
//                 </label>
//                 <input
//                     className="w-full p-2 border border-gray-300 rounded"
//                     type="text"
//                     id="appLink"
//                     value={appData.appLink}
//                     onChange={handleAppDataChange}
//                 />
//                 </div>
//                 <div className="mb-4">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="videoLink">
//                     Video Link
//                 </label>
//                 <input
//                     className="w-full p-2 border border-gray-300 rounded"
//                     type="text"
//                     id="videoLink"
//                     value={appData.videoLink}
//                     onChange={handleAppDataChange}
//                 />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="github">
//                         GitHub
//                     </label>
//                     <input
//                         className="w-full p-2 border border-gray-300 rounded"
//                         type="text"
//                         id="github"
//                         value={appData.github}
//                         onChange={handleAppDataChange}
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="type">
//                         Category
//                     </label>
//                     <select
//                         className="w-full p-2 border border-gray-300 rounded"
//                         id="type"
//                         value={appData.type}
//                         onChange={handleChange}
//                     >
//                         {categoryOptions.map(category => (
//                             <option key={selectedCategory} value={selectedCategory}>
//                                 {category}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="mb-4">
//                 {/* <CustomSelect multiple options={options} value={value} onChange={o => setValue(o)}/> */}
                
//                 {/* <MultiSelect
//                     options={techOptions}
//                     value={selectedTech}
//                     onChange={handleSelectChange}
//                     labelledBy="Select"
                
//                 /> */}
//                 </div>
//                 <div className="mb-4">
//                 <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="appImage">
//                     App Image
//                 </label>
//                 <input
//                     className="w-full"
//                     type="file"
//                     id="appImage"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                 />
//                 </div>
//                 <button
//                 className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
//                 type="submit"
//                 >
//                 Add App
//                 </button>
//             </form>
//             </div>
//         </div>
//         </div>
//     );
// }