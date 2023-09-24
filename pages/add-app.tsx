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
import { AppDataProps } from "@/components/types";
import { typeOptions, techOptions } from "../app-data/selectOptions";
import { z } from "zod";
import Navbar from "@/components/Navbar/Navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AppInput from "@/components/AppInput";

export const FormSchema = z.object({
  appName: z.string().nonempty({ message: "App Name is required" }),
  description: z.string().nonempty({ message: "Description is required" }),
  developers: z
    .array(z.object({ fullName: z.string() }))
    .min(1, { message: "Developers are required" }),
  appLink: z.string().url().optional(),
  videoLink: z.string().url().optional(),
  github: z.string().url({ message: "Please enter valid Github Link URL" }),
  type: z.string().nonempty({ message: "Category is required." }),
  technologies: z
    .array(z.string())
    .min(1, { message: "Technologies are required" })
    .max(5, { message: "You can select up to 5 technologies" }),
});

export type FormSchemaType = z.infer<typeof FormSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const router = useRouter();
  const { data: session } = useSession();
  const [appData, setAppData] = useState<FormSchemaType>(defaultApp);
  console.log(appData);

  const nameOptions = allDevs.map((name) => ({
    value: String(name.id),
    label: name.fullName,
  }));

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
      
      // Check if inputName is a valid key in AppDataProps
      if (inputName in newAppData) {
        newAppData[inputName as keyof FormSchemaType] = targetValue;
      }
    }
    console.log(typeof event.label);
    console.log(newAppData);
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

  const validateFormData = () => {
    const validationResult = FormSchema.safeParse(appData);
    console.log("validationResult", validationResult);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (error) => error.message
      );
      console.log("Validation Error:", errorMessages);
      return false;
    }
    console.log("Validation Result:", validationResult.data);
    return true;
  };

  const onSubmit = async (event: any) => {
    event.preventDefault();

    if (validateFormData()) {
      console.log(appData);
      axios
        .post(
          "/api/appRoutes/",
          { ...appData, signedInUser: session?.user?.email },
          {
            // headers: {
            // "Content-Type": "multipart/form-data",
            // },
          }
        )
        .then(function (response) {
          console.log(response);
          router.push("/profile");
        })
        .catch(function (error) {
          console.log(error);
          alert(error.response.data.errors);
        });
    } else {
      alert("Please fill in all required fields properly");
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
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className={styles.addAppFormWrapper}
          >
            <AppInput
              id="appName"
              name="appName"
              label="App Name *"
              type="text"
              placeholder="Enter app name"
              register={register}
              error={errors.appName?.message}
              disabled={isSubmitting}
              onChange={handleChange}
            />
            <label className="text-gray-700" htmlFor="description">
              Description *
            </label>
            <textarea
              className="border border-gray-300 rounded-md p-2 w-full mb-4"
              value={appData.description}
              onChange={handleChange}
              name="description"
              id="description"
            ></textarea>
            <AppInput
              id="github"
              name="github"
              label="GitHub Link"
              type="url"
              placeholder="https://github.com/"
              register={register}
              error={errors.github?.message}
              disabled={isSubmitting}
              value={appData.github}
              onChange={handleChange}
            />
            <AppInput
              id="appLink"
              name="appLink"
              label="App Link"
              type="url"
              placeholder="https://appLink.com/"
              register={register}
              error={errors.appLink?.message}
              disabled={isSubmitting}
              value={appData.appLink}
              onChange={handleChange}
            />
            <AppInput
              id="videoLink"
              name="videoLink"
              label="Video Link"
              type="url"
              placeholder="https://videoLink.com/"
              register={register}
              error={errors.appLink?.message}
              disabled={isSubmitting}
              value={appData.videoLink}
              onChange={handleChange}
            />
            <label className="text-gray-700" htmlFor="type">
              Category *
            </label>
            <Select
              options={typeOptions}
              onChange={handleChange}
              instanceId="appType"
              className="w-full mb-4"
            />
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
            />
            {errors.technologies && (
              <div className="text-red-500 text-sm mt-1">
                {errors.technologies?.message}
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
            />
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
