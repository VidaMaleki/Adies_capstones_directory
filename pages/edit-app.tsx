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

const FormSchema = z.object({
  appName: z.string().nonempty({ message: "App Name is required" }),
  id: z.string(),
  description: z.string().nonempty({ message: "Description is required" }),
  developers: z
    .array(
      z.object({
        fullName: z.string(),
        id: z.number(),
      })
    )
    .min(1, { message: "Developers are required" }),
  appLink: z.string().url({ message: "Invalid App Link URL" }).optional(),
  videoLink: z.string().url({ message: "Invalid Video Link URL" }).optional(),
  github: z.string().url({ message: "Invalid Github Link URL" }),
  type: z.string().nonempty({ message: "Category is required." }),
  technologies: z
    .array(z.string())
    .min(1, { message: "Technologies are required" }),
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
      appId: { in: [0, signedInUser?.appId || 0] },
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
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appData, setAppData] = useState<FormSchemaType>(
    convertAppToFormSchema(app)
  );
  const [isSaving, setIsSaving] = useState(false);
  const nameOptions = allDevs.map((name) => ({
    value: String(name.id),
    label: name.fullName,
  }));

  const handleCancel = (event: any) => {
    event.preventDefault();
    router.push("/profile");
  };

  const handleSave = (event: any) => {
    event.preventDefault();
    setIsSaving(true);
    axios
      .put(`/api/appRoutes?id=${appData.id}`, {...appData, signedInUser: session?.user?.email})
      .then(function (response) {
        console.log(response);
        toast.success("Your app information was successfully updated");
        // Need to trigger a refresh
        router.push("/profile");
      })
      .catch(function (error) {
        console.log(error);
        alert(error.response?.data?.errors || error.response?.data?.message);
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

  const handleDevChange = (event: any) => {
    console.log("event", event);
    const newAppData = { ...appData };
    const currDevs: Developer[] = event.map(
      (option: { value: string; label: string }) => {
        const devId = option.value;
        const filteredDev = allDevs.find(
          (devData) => devData.id.toString() === devId
        );
        return filteredDev;
      }
    );

    newAppData.developers = currDevs;
    setAppData(newAppData);
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
              App Name
            </label>
            <input
              type="text"
              id="appName"
              name="appName"
              value={appData.appName}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              required
            />
            <label htmlFor="description" className="text-gray-700">
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
            <label htmlFor="github" className="text-gray-700">
              GitHub
            </label>
            <input
              type="text"
              id="github"
              name="github"
              value={appData.github}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
            <label htmlFor="appLink" className="text-gray-700">
              App Link
            </label>
            <input
              type="text"
              id="appLink"
              name="appLink"
              value={appData.appLink}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
            <label htmlFor="videoLink" className="text-gray-700">
              Video Link
            </label>
            <input
              type="text"
              id="videoLink"
              name="videoLink"
              value={appData.videoLink}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
              required
            />
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
