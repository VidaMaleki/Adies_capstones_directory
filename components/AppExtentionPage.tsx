import AppCard from "./AppCard";
import styles from "@/styles/AppPage.module.css";
// import { App } from "@prisma/client";
import { AppWithDevelopersProps } from './types';
import { useState } from "react";

interface Props {
  apps: AppWithDevelopersProps[];
  page: string;
  pageSize: number;
}

const AppExtentionPage = ({ apps, page, pageSize }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  // Calculating page numbers
  const totalPages = Math.ceil(apps.length / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, apps.length);
  const currentApps = apps.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className={styles.extendedPageContainer}>
      <h1 className={styles.extendedPageHeader}>{page}</h1>
      <div className={styles.appListContainer}>
        {currentApps.map((app) => (
          <AppCard key={app.id} app={app} />
        ))}
      </div>
      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button className={styles.previousPage} onClick={goToPrevPage}>
            Previous
          </button>
        )}
        <div className={styles.pageNumbers}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? styles.currentPage : styles.pageNumber}
              onClick={() => goToPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {currentPage < totalPages && (
          <button className={styles.nextPage} onClick={goToNextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};
export default AppExtentionPage;
