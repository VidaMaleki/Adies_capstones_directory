import styles from "@/styles/appDetailsPopup.module.css";
import * as FaIcons from "react-icons/fa";
import Image from "next/image";
import { AppWithDevelopersProps } from "../types";
import { useEffect, useState } from "react";
import { getImageByAppType } from "../../utils/helper";

interface Props {
  app: AppWithDevelopersProps;
  onClose: () => void;
}

const AppDetailsPopup: React.FC<Props> = ({ app, onClose }) => {
  const defaultImage =
    "/Users/andiegarcia/Developer/Adies_capstones/Adies_capstones_directory/public/auth/default-app.png";
  // There was a conflict with the props from App.image that doesn't exist anymore in the db (line 33). Image replaced for an image in public folder instead
  // const developersName = app.developers.length === 1 ? app.developers[0] : app.developers.join(', ');
  const developers = app.developers;
  const [picture, setPicture] = useState("");

  const developersElement =
    developers && developers.length === 1
      ? developers[0]
      : developers?.join(", ") ?? "";
  const developerNamesString =
    developers?.map((developer) => developer.fullName).join("\n") ?? "";

  useEffect(() => {
    const imagePath = getImageByAppType(app.type);
    setPicture(imagePath);
  }, [app.type]);

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.closingPop}>
          <button className={styles.closeButton} onClick={onClose}>
            X
          </button>
        </div>
        <div className={styles.appContentContainer}>
          <div className={styles.imageContainer}>
            {/* change to Image from next/image */}
            <Image src={picture} alt="app picture" width={700} height={500} />
          </div>
          <div className={styles.textContainer}>
            <div className={styles.appDetailsContainer}>
              <div className={styles.appPopupTitleWraper}>
                <h2 className={styles.appPopupTitle}>{app.appName}</h2>
                {app.github && (
                  <a href={app.github} target="_blank">
                    <FaIcons.FaGithub />
                  </a>
                )}
              </div>

              <h3 className={styles.appPopupText}>
                Created by:
                <p className={styles.appPopupSubText}>{developerNamesString}</p>
              </h3>

              <h3 className={styles.appPopupText}>
                Description:
                <p className={styles.appPopupSubText}>{app.description}</p>
              </h3>
              <h3 className={styles.appPopupText}>
                Technologies:
                <p className={styles.appPopupSubText}>
                  {app.technologies.join(", ")}
                </p>
              </h3>
            </div>
            <div className={styles.viewApplinks}>
              {app.appLink && (
                <a href={app.appLink} target="_blank">
                  View App
                </a>
              )}
              {!app.appLink && app.videoLink && (
                <a href={app.videoLink} target="_blank">
                  View Video
                </a>
              )}
              {!app.appLink && !app.videoLink && app.github && (
                <a href={app.github} target="_blank">
                  View GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailsPopup;
