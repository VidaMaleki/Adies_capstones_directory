import * as React from "react";
import { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import styles from "@/styles/AppCard.module.css";
import { AppWithDevelopersProps } from "./types";
import Image from "next/image";
import { getImageByAppType } from "../helpers/helper";
import AppDetailsPopup from "./appDetailsPopUp";

type AppCardProps = {
  app: AppWithDevelopersProps;
};

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [picture, setPicture] = useState("");

  const { appName, appLink, github, technologies, developers, type } = app;
  const developerNamesString =
    developers?.map((developer) => developer.fullName).join(", ") ?? "";

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const imagePath = getImageByAppType(app.type);
    setPicture(imagePath);
  }, [app.type]);

  return (
    <div className={styles.card}>
      <div className={styles.appMiniScreen} onClick={handleOpenPopup}>
        <div className={styles.appMiniScreenInner}>
          <Image src={picture} alt="app picture" width={200} height={200} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.appCardHeader}>
          <h3 className="font-bold">{appName}</h3>
          <a className={styles.cardGitHub} href={github} target="_blank">
            <div className={styles.iconContainer}>
              <FaIcons.FaGithub />
            </div>
          </a>
        </div>
        <h3>Created by: {developerNamesString}</h3>
        <h3>Tech Stack: {technologies.join(", ")}</h3>
      </div>
      <div className={styles.cardFooterButtons}>
        <a href={appLink ?? ""} className={styles.cardView} target="_blank">
          View
        </a>
        <button className={styles.cardDetails} onClick={handleOpenPopup}>
          Details
        </button>
      </div>
      {showPopup && <AppDetailsPopup app={app} onClose={handleClosePopup} />}
    </div>
  );
};

export default AppCard;
