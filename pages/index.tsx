import Head from 'next/head'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import styles from '@/styles/Home.module.css'
import Link from "next/link";
import apps from "../app-data/app-data.json"
import AppCard from '@/components/appCard';
// import AppDetailsPopup from '@/components/appDetailsPopup';

export default function Home() {
  const webApps: any[] = [];
  const mobileApps: any[] = [];
  const gamingApps: any[] = [];
  const socialApps: any[] = [];

  apps.forEach(app => {
    if (app.type === "web") {
      webApps.push(app);
    } else if (app.type === "mobile") {
      mobileApps.push(app);
    } else if (app.type === "game") {
      gamingApps.push(app);
    } else if (app.type === "social") {
      socialApps.push(app);
    }
  });

  // Randomly select 5 apps for each category
  const webAppsRandom: any[] = [];
  const mobileAppsRandom: any[] = [];
  const gamingAppsRandom: any[] = [];
  const socialAppsRandom: any[] = [];

  const getRandomApps = (appsList: any[], randomList: any[]) => {
    const shuffled = appsList.sort(() => 0.5 - Math.random());
    randomList.push(...shuffled.slice(0, 5));
  }

  getRandomApps(webApps, webAppsRandom);
  getRandomApps(mobileApps, mobileAppsRandom);
  getRandomApps(gamingApps, gamingAppsRandom);
  getRandomApps(socialApps, socialAppsRandom);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const handlePopup = (app: any) => {
    setShowPopup(true);
    setSelectedApp(app);
  };

  return (
    <>
      <Head>
        <title>Adies Capstones Hub</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/favicon.ico" type="images/AdieLogo-browser.png"></link>
        <link rel="icon" href="/favicon.ico" type="images/AdieLogo-browser.png"/>
      </Head>
      <main className={styles.main}>
        <Navbar/>
        <section className={styles.appsWrapper}>
          <div>
            <div className={styles.appsHeader}>
              <h2>Web apps</h2>
              <button className={styles.seeMoreButton}>
                <Link href="/web-apps" className={styles.seeMoreText}>See more</Link>
              </button>
            </div>
            <div className={styles.appsCardGrid}>
              {webAppsRandom.map((app)=> (
                <AppCard
                  name={app.appName}
                  description={app.description}
                  appLink={app.appLink}
                  key={app.id}
                  linkedin={app.linkedin}
                  app={app}
                  onClose={() => handlePopup(app)}
                  id={app.id}
                />
              ))}
            </div>
          </div>
          <div>
            <div className={styles.appsHeader}>
              <h2>Mobile apps</h2>
              <button className={styles.seeMoreButton}>
                <Link href="/mobile-apps" className={styles.seeMoreText}>See more</Link>
              </button>
            </div>
            <div className={styles.appsCardGrid}>
              {mobileAppsRandom.map((app)=> (
                <AppCard
                  name={app.appName}
                  description={app.description}
                  appLink={app.appLink}
                  key={app.id}
                  linkedin={app.linkedin}
                  app={app}
                  onClose={() => handlePopup(app)}
                  id={app.id}
                  />
                ))}
              </div>
            </div>
          <div>
          <div className={styles.appsHeader}>
              <h2>Gaming apps</h2>
              <button className={styles.seeMoreButton}>
                <Link href="/game-apps" className={styles.seeMoreText}>See more</Link>
              </button>
            </div>
            <div className={styles.appsCardGrid}>
            {gamingAppsRandom.map((app)=> (
              <AppCard
              name={app.appName}
              description={app.description}
              appLink={app.appLink}
              key={app.id}
              linkedin={app.linkedin}
              app={app}
              onClose={() => handlePopup(app)}
              id={app.id}
              />
            ))}
            </div>
          </div>
          <div>
          <div className={styles.appsHeader}>
              <h2>Social Media apps</h2>
              <button className={styles.seeMoreButton}>
                <Link href="/social-apps" className={styles.seeMoreText}>See more</Link>
              </button>
            </div>
            <div className={styles.appsCardGrid}>
            {socialAppsRandom.map((app)=> (
              <AppCard
              name={app.appName}
              description={app.description}
              appLink={app.appLink}
              key={app.id}
              linkedin={app.linkedin}
              app={app}
              onClose={() => handlePopup(app)}
              id={app.id}
              />
            ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
