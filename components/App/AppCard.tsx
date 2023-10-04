import * as React from "react";
import { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import styles from "@/styles/AppCard.module.css";
import { AppWithDevelopersProps } from "../types";
import Image from "next/image";
import { getImageByAppType } from "../../utils/helper";
import AppDetailsPopup from "./appDetailsPopUp";

type AppCardProps = {
  app: AppWithDevelopersProps;
};

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [picture, setPicture] = useState("");

  const { appName, appLink, github, technologies, developers, type } = app;

  let developersList: React.ReactNode;

  if (developers && developers.length === 1) {
    developersList = <p>{developers[0].fullName}</p>;
  } else if (developers && developers.length > 1) {
    developersList = (
      <ol className={styles.developersList}>
        {developers.map((developer, index) => (
          <li key={developer.id}>{`${index + 1}. ${developer.fullName}`}</li>
        ))}
      </ol>
    );
  } else {
    // Handle the case when developers is undefined or empty
    developersList = <p>No developers specified</p>;
  }

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
        <div className={styles.developersWrapper}>
          <h3>
            Created by:
          </h3>
          <div className={styles.developersList}>
            {developersList}
          </div>
        </div>
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
