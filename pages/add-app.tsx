import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import styles from "@/styles/addApp.module.css";
import pageWrapperStyle from "@/styles/PageWrapper.module.css";
import { db } from "@/lib/db";
import { Developer } from "@prisma/client";
import { useState } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import { useRouter } from "next/router";
import { typeOptions, techOptions } from "../app-data/selectOptions";
import { z } from "zod";
import Navbar from "@/components/Navbar/Navbar";
import { InputErrors } from "@/components/types";
import { toast } from 'react-toastify';

export const FormSchema = z.object({
  appName: z.string().nonempty({ message: "App Name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  developers: z
    .array(z.object({ fullName: z.string() }))
    .min(1, { message: "Developers are required" }),
  appLink: z.string().url().nullish(),
  videoLink: z.string().url().nullish(),
  github: z.string().url().nonempty({ message: "Github Link is required" }),
  type: z.string().nonempty({ message: "Category is required." }),
  technologies: z
    .array(z.string())
    .min(1, { message: "Technologies are required" })
    .max(5, { message: "You can select up to 5 technologies" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  const allDevs: Developer[] = await db.developer.findMany();
  // Get the signed in (if signed in) dev here, add as prop
  // Current work around to not get error when querying db by user email
  let userEmail = session?.user?.email ? session.user.email : "";
  const signedInUser = await db.developer.findUnique({
    where: {
      email: userEmail,
    },
  });
  return {
    props: {
      session,
      allDevs,
      signedInUser,
    },
  };
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
export default function Capstone({
  allDevs,
  signedInUser,
}: {
  allDevs: Developer[];
  signedInUser: Developer;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [appData, setAppData] = useState<FormSchemaType>(defaultApp);
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const nameOptions = allDevs.map((name) => ({
    value: String(name.id),
    label: name.fullName,
  }));

  const handleChange = (event: any) => {
    let newAppData: FormSchemaType = { ...appData };
    if (event.label) {
      // Event for app type has one option, so it returns {value: "", label: ""}
      // https://stackoverflow.com/questions/71934348/react-event-target-is-undefined-when-trying-to-filter-react-select-options
      newAppData.type = event.label;
    } else {
      // All non-array values for app
      const inputName = event.target.name;
      let targetValue = event.target.value;
      // Handle null or undefined values
      if (targetValue === null || targetValue === undefined) {
        targetValue = "";
      }
      // Check if inputName is a valid key in AppDataProps
      if (inputName in newAppData) {
        newAppData[inputName as keyof FormSchemaType] = targetValue;
      }
    }
    setAppData(newAppData);
  };

  const handleTechnologiesChange = (event: any) => {
    let newAppData: FormSchemaType = { ...appData };
    const currTechs = event.map((option: { label: any }) => option.label);
    newAppData.technologies = currTechs;
    setAppData(newAppData);
  };

  const handleDevChange = (event: any) => {
    let newAppData: FormSchemaType = { ...appData };
    const currDevs: { fullName: string }[] = event.map(
      (option: { value: string; label: string }) => ({ fullName: option.label })
    );
    newAppData.developers = currDevs;
    setAppData(newAppData);
  };
  // Commenting this function for now since I am validating directly in onSubmit
  // const validateFormData = () => {
  //   const validationResult = FormSchema.safeParse(appData);
  //   if (!validationResult.success) {
  //     const errors: InputErrors = {};
  //     validationResult.error.errors.forEach((error) => {
  //       // Use type assertion to inform TypeScript that error.path.join('.') is a valid key
  //       const fieldName = error.path.join('.') as keyof InputErrors;
  //       errors[fieldName] = error.message;
  //     });
  //     setInputErrors(errors);
  //     return false;
  //   }
  //   setInputErrors({});
  //   return true;
  // };

  const schemaPathToInputName: Record<string, keyof InputErrors> = {
    appName: "appName",
    description: "description",
    developers: "developers",
    appLink: "appLink",
    videoLink: "videoLink",
    github: "github",
    type: "type",
    technologies: "technologies",
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = {
      ...appData,
      appLink: appData.appLink || null,
      videoLink: appData.videoLink || null,
    };
    try {
      FormSchema.parse(formData);
      // Form data is valid, proceed with form submission logic...
      axios
        .post("/api/appRoutes/", {
          ...appData,
          signedInUser: session?.user?.email,
        })
        .then(function (response) {
          console.log(response);
          router.push("/profile");
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const inputErrors: InputErrors = {};
        console.log("error", error);
        error.errors.forEach((validationError) => {
          const fieldName = schemaPathToInputName[validationError.path[0]];
          if (fieldName) {
            inputErrors[fieldName] = validationError.message;
          }
        });
        // Set inputErrors state to display error messages in the UI
        setInputErrors(inputErrors);

        // Show error messages.
        toast.error("Please address error messages");
      }
    }
  };

  return (
    <div className={pageWrapperStyle.pageWrapper}>
      <Navbar />
      <div className={styles.appCardContainer}>
        <div className="mt-10 mb-10 w-[100%] flex flex-col px-12 py-4 sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex items-center justify-center">
          <div>
            <h2 className="text-center text-2x1 font-bold tracking-wide text-gray-800">
              Add App
            </h2>
          </div>
          <br />
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className={styles.addAppFormWrapper}
          >
            <label className="text-gray-700" htmlFor="appName">
              App Name *
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              type="text"
              value={appData.appName}
              onChange={handleChange}
              name="appName"
              id="appName"
              style={{
                borderColor: `${inputErrors.appName ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.appName && (
              <div className="text-red-500 mb-2">{inputErrors.appName}</div>
            )}
            <label className="text-gray-700" htmlFor="description">
              Description *
            </label>
            <textarea
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              value={appData.description}
              onChange={handleChange}
              name="description"
              id="description"
              style={{
                borderColor: `${inputErrors.description ? "#ED4337" : ""}`,
              }}
            ></textarea>
            {inputErrors.description && (
              <div className="text-red-500 mb-2">{inputErrors.description}</div>
            )}
            <label className="text-gray-700" htmlFor="github">
              Github Link *
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              type="text"
              value={appData.github}
              onChange={handleChange}
              name="github"
              id="github"
              style={{
                borderColor: `${inputErrors.github ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.github && (
              <div className="text-red-500 mb-2">{inputErrors.github}</div>
            )}
            <label className="text-gray-700" htmlFor="appLink">
              App Link
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              type="text"
              value={appData.appLink || ""}
              onChange={handleChange}
              name="appLink"
              id="appLink"
              style={{
                borderColor: `${inputErrors.appLink ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.appLink && (
              <div className="text-red-500 mb-2">{inputErrors.appLink}</div>
            )}
            <label className="text-gray-700" htmlFor="videoLink">
              Video Demo Link
            </label>
            <input
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              type="text"
              value={appData.videoLink || ""}
              onChange={handleChange}
              name="videoLink"
              id="videoLink"
              style={{
                borderColor: `${inputErrors.videoLink ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.videoLink && (
              <div className="text-red-500 mb-2">{inputErrors.videoLink}</div>
            )}
            <label className="text-gray-700" htmlFor="type">
              Category *
            </label>
            <Select
              options={typeOptions}
              onChange={handleChange}
              instanceId="appType"
              className="w-full mb-4"
              name="type"
            />
            {inputErrors.type && (
              <div className="text-red-500 mb-2">{inputErrors.type}</div>
            )}
            <label className="text-gray-700" htmlFor="technologies">
              Technologies *
            </label>
            <CreatableSelect
              options={techOptions}
              onChange={handleTechnologiesChange}
              isMulti
              isClearable
              instanceId="appTechnologies"
              className="mb-4"
              name="technologies"
            />
            {inputErrors.technologies && (
              <div className="text-red-500 mb-2">
                {inputErrors.technologies}
              </div>
            )}
            <label className="text-gray-700" htmlFor="developers">
              Developers *
            </label>
            <Select
              options={nameOptions}
              onChange={handleDevChange}
              isMulti
              isClearable
              instanceId="appDevs"
              className="mb-4"
              name="developers"
            />
            {inputErrors.developers && (
              <div className="text-red-500 mb-2">{inputErrors.developers}</div>
            )}
            <input
              type="submit"
              value="Add"
              className="bg-teal-200 drop-shadow text-gray-700 px-4 py-2 rounded-md"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
