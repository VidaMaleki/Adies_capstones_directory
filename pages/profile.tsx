import { NextPageContext } from "next";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { FaSignOutAlt } from "react-icons/fa";
import { AiFillSetting, AiOutlineEdit } from "react-icons/ai";
import Link from "next/link";
import { db } from "@/lib/db";
import axios from "axios";
import AppCard from "@/components/App/AppCard";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar/Navbar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AppWithDevelopersProps,
  DeveloperWithAppProps,
} from "../components/types";
import Settings from "@/components/profile/Settings";
import pageWrapperStyle from "@/styles/PageWrapper.module.css";
import ProfilePictureSelection from "../components/profile/ProfilePictureSelection";
import { toast } from "react-toastify";

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  let userEmail = session?.user?.email ? session.user.email : "";

  const signedInUser = await db.developer.findUnique({
    where: {
      email: userEmail,
    },
    include: {
      // Associated apps for the developer
      app: {
        include: {
          developers: true,
        },
      },
    },
  });

  return {
    props: {
      session,
      signedInUser,
    },
  };
}

export default function Profile({
  signedInUser,
}: {
  signedInUser: DeveloperWithAppProps & { app: AppWithDevelopersProps };
}) {
  const app_url = `${process.env.NEXT_PUBLIC_APP_URL}`;
  const dev_url = `${process.env.NEXT_PUBLIC_DEV_URL}`;
  const { data: session, status } = useSession();
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();
  const [developerData, setDeveloperData] = useState<DeveloperWithAppProps>(
    signedInUser || ({} as DeveloperWithAppProps)
  );
  const [selectedPicture, setSelectedPicture] = useState(signedInUser?.image);
  const [isSelectingPicture, setIsSelectingPicture] = useState(false);
  const handleDelete = () => {
    axios
      .delete(`${app_url}?id=${signedInUser.appId}`)
      .then(function (response) {
        console.log(response);
        toast.success("Your app was successfully deleted");
        // Need to trigger a refresh
        router.reload();
      })
      .catch(function (error) {
        console.log(error);
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Could not delete app, try again");
        }
      });
  };

  const handleOpenSetting = () => {
    setShowSettings(true);
  };

  const onClose = () => {
    setShowSettings(false);
  };

  const handleOpenPictureSelection = () => {
    setIsSelectingPicture(true);
  };

  const handleClosePictureSelection = () => {
    setIsSelectingPicture(false);
  };

  const handlePictureSelection = (picture: string) => {
    console.log("Selected image:", picture);
    axios
      .put(`${dev_url}?id=${signedInUser.id}`, {
        id: developerData.id,
        email: developerData.email,
        image: picture,
      })
      .then(function (response) {
        console.log("Response from server:", response);
        toast.success("Profile picture updated successfully");
        // Update the state to reflect the selected picture
        setSelectedPicture(picture);
        handleClosePictureSelection();
        router.reload();
      })
      .catch(function (error: any) {
        toast.error("Could not update profile picture, please try again");
      });
  };

  useEffect(() => {
    // Redirect to home page if user is not authenticated
    if (!signedInUser) {
      router.push("/");
    }
  }, [signedInUser, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If session is not available, the redirect will happen on the client side
  if (!session) {
    return null;
  }

  return (
    <div className={pageWrapperStyle.pageWrapper}>
      <Navbar />
      <div className="mx-auto w-4/5 pt-40 mb-20 xs:w-4/5 sm:w-3/5 md:w-3/5 lg:w-2/5 2xl:w-2/5">
        <div className="border border-gray-400 drop-shadow relative flex flex-col w-full rounded-lg">
          <div className="w-full flex flex-col items-center text-center p-4 bg-gray-100 rounded-t-lg">
            <div className="w-2 flex justify-between px-8 py-8">
              <div>
                <button
                  onClick={handleOpenSetting}
                  className="absolute top-0 left-0 mt-2 mr-2 drop-shadow text-gray-500 pt-4 pl-4 flex gap-2"
                >
                  <AiFillSetting size={24} />
                  Setting
                </button>
              </div>
              <div>
                <button
                  className="absolute top-0 right-0 mt-2 mr-2 drop-shadow text-gray-500 pt-4 pr-4 flex gap-2"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt size={24} />
                  Log out
                </button>
              </div>
            </div>
            <div className="w-8 flex justify-center items-center">
              <h2 className="text-2xl text-gray-600 font-bold drop-shadow">
                Profile
              </h2>
            </div>
            <br></br>
            <div className="w-full flex justify-center">
              <Image
                src={
                  signedInUser?.image
                    ? `/profile-pictures/${signedInUser?.image}.png`
                    : `/profile-pictures/45.png`
                }
                alt={`${signedInUser?.fullName} image`}
                width={100}
                height={100}
                className="rounded-full w-40 h-40 border border-gray-300"
              />
            </div>
            <div className="w-full mt-4 flex justify-center items-center">
              <button
                className="text-teal-500 hover:text-teal-600 flex items-center justify-center"
                onClick={handleOpenPictureSelection}
              >
                <AiOutlineEdit className="mr-2" /> Change Profile Picture
              </button>
            </div>
            {isSelectingPicture && ( // Conditionally render the picture selection component
              <div className="w-full mt-4 flex  flex-col justify-center items-center">
                <ProfilePictureSelection
                  selectedPicture={selectedPicture}
                  onSelectPicture={handlePictureSelection}
                />
                <br></br>
                <button
                  className="text-teal-500 hover:text-teal-600 flex items-center"
                  onClick={handleClosePictureSelection}
                >
                  Cancel
                </button>
              </div>
            )}
            <br></br>
            <p className="text-gray-600 drop-shadow text-center">
              Welcome, {signedInUser?.fullName}! Here are your app details:
            </p>
            <br></br>
          </div>
          <div className="p-4">
            {signedInUser?.app ? (
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex justify-center gap-10">
                  <Link
                    href="/edit-app"
                    className="flex justify-center items-center"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                  <button
                    className="flex items-center text-red-600"
                    onClick={handleDelete}
                  >
                    <FaTrashAlt className="mr-2" />
                    Delete
                  </button>
                </div>
                <div className="flex justify-center items-center">
                  {signedInUser?.appId && <AppCard app={signedInUser?.app} />}
                </div>
              </div>
            ) : (
              <div className="text-gray-600 text-center">
                <p className="mt-6 text-center">
                  You have not added any apps yet. Click the button below to add
                  an app.
                </p>
                <p className="mt-6 text-center">
                  *Note: If you have group project, you can add only developers
                  that already created account.
                </p>
              </div>
            )}
            {!signedInUser?.app && ( // Render the button only if app is not present
              <div className="w-full mb-10 flex justify-center items-center">
                <Link
                  href={`/add-app`}
                  className="bg-teal-300 text-gray-700 drop-shadow px-4 py-2 rounded mt-4"
                >
                  Add App
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSettings && (
        <Settings signedInUser={signedInUser} onClose={onClose} />
      )}
    </div>
  );
}
