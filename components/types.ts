import { Developer, App } from "@prisma/client";

export interface DeveloperProps {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  image: string;
  cohort: string;
  linkedin: string;
  password: string;
  app?: App;
  appId?: number;
}

export interface DeveloperWithAppProps extends Developer {
  app?: App;
}

export interface AppWithDevelopersProps extends App {
  developers: DeveloperProps[];
}

export interface AppWithIdProps extends AppDataProps {
  id: number;
}

export interface AppDataProps {
  id: number;
  appName: string;
  description: string;
  developers: Developer[];
  appLink?: string | null;
  videoLink?: string | null;
  github: string;
  type: string;
  technologies: string[];
  signedInUser: string | undefined;
}

export interface AppInputProps {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  register: any;
  error: any;
  disabled: boolean;
  onChange?: (name: string, value: string) => void;
  value?: string;
}
export interface SignupInputProps {
  name: string;
  label: string;
  type: string;
  icon: JSX.Element;
  placeholder: string;
  register: any;
  error: any;
  disabled: boolean;
}

export interface ISlideButtonProps {
  type: "submit" | "reset" | "button";
  text: string;
  slide_text: string;
  disabled: boolean;
  icon: JSX.Element;
}

export interface NavButtonProps {
  href: string;
  name: string;
  isSpecial?: boolean;
}

export interface InputErrors {
  appName?: string;
  description?: string;
  developers?: string;
  appLink?: string;
  videoLink?: string;
  github?: string;
  type?: string;
  technologies?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AllDev {
  id: number;
  fullName: string;
  appId: number | null;
}
