import * as React from 'react';
import { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { App } from "@prisma/client";
import AppDetailsPopup from './AppDetailsPopUp';
import styles from '@/styles/AppCard.module.css';
import { AppWithDevelopersProps } from './types';

type AppCardProps = {

  app: AppWithDevelopersProps;
};

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const [ showPopup, setShowPopup ] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const { appName, appLink, github, technologies, developers } = app;

  const developerNamesString = developers?.map((developer) => developer.fullName).join(', ') ?? '';

  return (
    <div className={styles.card}>
      <div className={styles.appMiniScreen} style={{ backgroundImage: picture }} onClick={handleOpenPopup}>
        <div ></div>
      </div>
      <div className={styles.content}>
        <div className={styles.appCardHeader}>
          <h3>{appName}</h3>
          <a className={styles.cardGitHub} href={github} target="_blank">
            <div className={styles.iconContainer}>
              <FaIcons.FaGithub />
            </div>
          </a>
        </div>
        <h3>Created by: {developerNamesString}</h3>
        <h3>Tech Stack: {technologies.join(', ')}</h3>
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