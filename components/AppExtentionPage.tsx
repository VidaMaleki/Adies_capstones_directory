import AppCard from "./appCard";
import styles from "@/styles/AppPage.module.css";
// import { App } from "@prisma/client";
import { AppWithIdProps } from "./types";

interface Props {
  apps: AppWithIdProps[];
  page: string;
}

const AppList = ({ apps, page }: Props) => {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.appHeader}>{page}</h1>
      <div className={styles.appListContainer}>
        {apps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

export default AppList;
