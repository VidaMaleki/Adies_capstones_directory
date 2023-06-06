import Head from "next/head";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { db } from "@/lib/db";
import { App } from "@prisma/client";
import AppSection from "@/components/AppSection";

export async function getServerSideProps() {
  const allApps: App[] = await db.app.findMany();
  return {
    props: {
      allApps: allApps,
    },
  };
}

export default function Home({ allApps }: { allApps: App[] }) {
  const [webAppsRandom, setWebAppsRandom] = useState<App[]>([]);
  const [mobileAppsRandom, setMobileAppsRandom] = useState<App[]>([]);
  const [gamingAppsRandom, setGamingAppsRandom] = useState<App[]>([]);
  const [socialAppsRandom, setSocialAppsRandom] = useState<App[]>([]);

  const getRandomApps = (appsList: any) => {
    if (appsList.length <= 5) return appsList;

    const shuffled = appsList.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
  };

  useEffect(() => {
    const webApps: App[] = [];
    const mobileApps: App[] = [];
    const gamingApps: App[] = [];
    const socialApps: App[] = [];

    allApps.forEach((app) => {
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

    setWebAppsRandom(getRandomApps(webApps));
    setGamingAppsRandom(getRandomApps(gamingApps));
    setSocialAppsRandom(getRandomApps(socialApps));
    setMobileAppsRandom(getRandomApps(mobileApps));
  }, []);

  return (
    <>
      <Head>
        {/* Head content */}
      </Head>
      <main className={styles.main}>
        <Navbar />
        <section className={styles.appsWrapper}>
          <AppSection
            sectionTitle="Web apps"
            apps={webAppsRandom}
            seeAllLink="/web-apps"
          />
          <AppSection
            sectionTitle="Mobile apps"
            apps={mobileAppsRandom}
            seeAllLink="/mobile-apps"
          />
          <AppSection
            sectionTitle="Gaming apps"
            apps={gamingAppsRandom}
            seeAllLink="/game-apps"
          />
          <AppSection
            sectionTitle="Social Media apps"
            apps={socialAppsRandom}
            seeAllLink="/social-apps"
          />
        </section>
      </main>
    </>
  );
}