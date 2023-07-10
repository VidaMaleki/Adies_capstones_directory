import * as React from 'react';
import Link from 'next/link';
import { App } from "@prisma/client";
import AppCard from './AppCard';
import styles from '@/styles/Home.module.css';
import { AppWithDevelopersProps } from './types';

type AppSectionProps = {
    sectionTitle: string;
    apps: AppWithDevelopersProps[];
    seeAllLink: string;
};

const AppSection: React.FC<AppSectionProps> = ({ sectionTitle, apps, seeAllLink }) => {
    return (
        <div>
        <div className={styles.appsHeader}>
            <h2>{sectionTitle}</h2>
            <div className={styles.seeMoreButton}>
            <Link href={seeAllLink} className={styles.seeMoreText}>
                See All
            </Link>
            </div>
        </div>
        <div className={styles.appsCardGrid}>
            {apps.map((app) => (
            <AppCard key={app.id} app={app} />
            ))}
        </div>
        </div>
    );
};

export default AppSection;