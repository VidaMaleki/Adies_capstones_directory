import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import Select, { ActionMeta, MultiValue } from "react-select";
import { typeOptions, techOptions } from "../app-data/selectOptions";
import { db } from "@/lib/db";
import axios from "axios";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { AppWithIdProps } from "@/components/types";
import CreatableSelect from "react-select/creatable";
import { Developer } from "@prisma/client";
import { z } from "zod";
import { toast } from "react-toastify";
import pageWrapperStyle from "@/styles/PageWrapper.module.css";
import styles from "@/styles/addApp.module.css";
import { InputErrors } from "@/components/types";

const FormSchema = z.object({
  id: z.string(),
  appName: z.string().nonempty({ message: "App Name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  developers: z
    .array(
      z.object({
        fullName: z.string(),
        id: z.number(),
      })
    )
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

export type FormSchemaType = z.infer<typeof FormSchema>;
interface EditAppProps {
  signedInUser: Developer;
  allDevs: Developer[];
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
      app: true,
    },
  });

  const app = await db.app.findUnique({
    where: {
      id: signedInUser?.appId || 0,
    },
    include: {
      developers: true,
    },
  });

  const allDevs: Developer[] = await db.developer.findMany({
    where: {
      OR: [
        { appId: null }, // Include developers with null appId (no app assigned)
        { appId: signedInUser?.appId || null }, // Include the signed-in user's app
      ],
    },
  });
  return {
    props: {
      session,
      allDevs,
      signedInUser: signedInUser || {},
      app,
    },
  };
}
const convertAppToFormSchema = (app: AppWithIdProps): FormSchemaType => {
  return {
    appName: app.appName,
    id: app.id.toString(),
    description: app.description,
    developers: app.developers,
    appLink: app.appLink || "",
    videoLink: app.videoLink || "",
    github: app.github,
    type: app.type,
    technologies: app.technologies,
  };
};

export default function EditApp({ signedInUser, allDevs, app }: EditAppProps) {
  const app_url = `${process.env.NEXT_PUBLIC_APP_URL}`;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appData, setAppData] = useState<FormSchemaType>(
    convertAppToFormSchema(app)
  );
  const [inputErrors, setInputErrors] = useState<InputErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const nameOptions = allDevs.map((name) => ({
    value: String(name.id),
    label: name.fullName,
  }));

  const handleCancel = (event: any) => {
    event.preventDefault();
    router.push("/profile");
  };

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

  const handleSave = (event: any) => {
    event.preventDefault();
    const formData = {
      ...appData,
      appLink: appData.appLink || null,
      videoLink: appData.videoLink || null,
    };

    setIsSaving(true);

    try {
      FormSchema.parse(formData);

      axios
        .put(`${app_url}?id=${appData.id}`, {
          ...formData,
          signedInUser: session?.user?.email,
        })
        .then(function (response) {
          console.log(response);
          toast.success("Your app information was successfully updated");
          // Need to trigger a refresh
          router.push("/profile");
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Server Error:", error.response.data);
            toast.error("Server Error: Please try again later.");
          } else if (error.request) {
            // The request was made but no response was received
            console.error("Network Error:", error.request);
            toast.error(
              "Network Error: Please check your internet connection."
            );
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error:", error.message);
            toast.error(`Error: ${error.message}`);
          }
        })
        .finally(() => {
          setIsSaving(false);
        });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const inputErrors: InputErrors = {};
        error.errors.forEach((validationError) => {
          const fieldName = schemaPathToInputName[validationError.path[0]];
          if (fieldName) {
            inputErrors[fieldName] = validationError.message;
          }
        });
        setInputErrors(inputErrors);
        setIsSaving(false);
        toast.error("Please address error messages");
      } else {
        console.error("Error:", error);
        toast.error(
          `Error: Please try again later we are working on this error.`
        );
      }
    }
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

  const handleChange = (event: any) => {
    let newAppData: FormSchemaType = { ...appData };
    if (event.label) {
      newAppData.type = event.label;
    } else {
      const inputName: string = event.target.name;
      const targetValue = event.target.value;
      newAppData[inputName as keyof FormSchemaType] = targetValue;
    }
    setAppData(newAppData);
  };

  const handleDevChange = (selectedOptions: any) => {
    // Map selected options to an array of developer IDs
    const selectedDeveloperIds: number[] = selectedOptions.map(
      (option: { value: string; label: string }) => parseInt(option.value, 10)
    );

    // Find developers from allDevs based on selected IDs
    const selectedDevelopers: Developer[] = allDevs.filter(
      (developer: Developer) => selectedDeveloperIds.includes(developer.id)
    );

    // Check if the signed-in user is not already in the developers list
    const signedInUserAlreadyAdded = selectedDevelopers.some(
      (developer: Developer) => developer.id === signedInUser.id
    );

    // If signed-in user is not in the list, add them to the beginning of the array
    if (!signedInUserAlreadyAdded) {
      selectedDevelopers.unshift(signedInUser);
    }

    setAppData((prevAppData) => ({
      ...prevAppData,
      developers: selectedDevelopers,
    }));
  };

  const handleTechnologiesleChange = (
    newValue: MultiValue<{ label: string; value: string }>,
    actionMeta: ActionMeta<{ label: string; value: string }>
  ) => {
    const currTechs = newValue.map((option: { label: any }) => option.label);
    const newAppData = { ...appData };
    newAppData.technologies = currTechs;
    setAppData(newAppData);
  };

  const findSelectedTechnologies = (
    techOptions: { value: string; label: string }[],
    selectedTechnologies: string[]
  ) => {
    const selectedTechOptions = [];
    const setSelectedTechnologies = new Set(selectedTechnologies);
    for (let option of techOptions) {
      if (setSelectedTechnologies.has(option.label)) {
        selectedTechOptions.push(option);
      }
    }
    console.log(selectedTechnologies, "options", selectedTechOptions);
    return selectedTechOptions;
  };

  return (
    <div className={pageWrapperStyle.pageWrapper}>
      <Navbar />
      <div className={styles.appCardContainer}>
        <div className="mb-10 w-[100%] flex flex-col px-12 py-4 sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex items-center justify-center">
          <div>
            <h2 className="text-center text-2x1 font-bold tracking-wide text-gray-800">
              Edit App
            </h2>
          </div>
          <form onSubmit={handleSave} className={styles.addAppFormWrapper}>
            <label htmlFor="appName" className="text-gray-700">
              App Name *
            </label>
            <input
              type="text"
              id="appName"
              name="appName"
              value={appData.appName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              style={{
                borderColor: `${inputErrors.appName ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.appName && (
              <div className="text-red-500 mb-2">{inputErrors.appName}</div>
            )}
            <label htmlFor="description" className="text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={appData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={5}
              style={{
                borderColor: `${inputErrors.description ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.description && (
              <div className="text-red-500 mb-2">{inputErrors.description}</div>
            )}
            <label htmlFor="github" className="text-gray-700">
              GitHub Link *
            </label>
            <input
              type="text"
              id="github"
              name="github"
              value={appData.github}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              style={{
                borderColor: `${inputErrors.github ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.github && (
              <div className="text-red-500 mb-2">{inputErrors.github}</div>
            )}
            <label htmlFor="appLink" className="text-gray-700">
              App Link
            </label>
            <input
              type="text"
              id="appLink"
              name="appLink"
              value={appData.appLink || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              style={{
                borderColor: `${inputErrors.appLink ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.appLink && (
              <div className="text-red-500 mb-2">{inputErrors.appLink}</div>
            )}
            <label htmlFor="videoLink" className="text-gray-700">
              Video Link
            </label>
            <input
              type="text"
              id="videoLink"
              name="videoLink"
              value={appData.videoLink || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              style={{
                borderColor: `${inputErrors.videoLink ? "#ED4337" : ""}`,
              }}
            />
            {inputErrors.videoLink && (
              <div className="text-red-500 mb-2">{inputErrors.videoLink}</div>
            )}
            <label htmlFor="appType" className="text-gray-700">
              Category
              <Select
                options={typeOptions}
                value={typeOptions.find((c) => c.label === appData.type)}
                onChange={handleChange}
                instanceId="appType"
                className="mb-4"
                required
              />
            </label>
            {inputErrors.type && (
              <div className="text-red-500 mb-2">{inputErrors.type}</div>
            )}
            <label htmlFor="technologies" className="text-gray-700">
              Technologies
              <CreatableSelect
                options={techOptions}
                value={findSelectedTechnologies(
                  techOptions,
                  appData.technologies
                )}
                onChange={handleTechnologiesleChange}
                isMulti
                isClearable
                instanceId="technologies"
                className="mb-4"
                required
              />
            </label>
            {inputErrors.technologies && (
              <div className="text-red-500 mb-2">
                {inputErrors.technologies}
              </div>
            )}
            <label className="text-gray-700" htmlFor="developers">
              Developers
            </label>
            <CreatableSelect
              options={nameOptions}
              value={appData.developers.map(
                (developer: { fullName: string; id: number }) => {
                  return {
                    label: developer?.fullName,
                    value: developer?.id.toString(),
                  };
                }
              )}
              onChange={handleDevChange}
              isMulti
              isClearable
              instanceId="appDevs"
              className="mb-4"
            />
            {inputErrors.developers && (
              <div className="text-red-500 mb-2">{inputErrors.developers}</div>
            )}
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
                className="bg-teal-200 drop-shadow text-gray-700 px-4 py-2 rounded-md"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
