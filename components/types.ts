import { Developer,  App } from "@prisma/client";

export interface DeveloperProps {
  id: number;
  fullName: string;
  email: string;
  emailVerified: boolean;
  image: string;
  cohort: string;
  linkedin: string;
  password: string;
  app: AppDataProps; 
  appId: number;
}

export interface DeveloperWithAppProps extends Developer {
  app?: AppWithIdProps; 
}

export interface AppWithDevelopersProps extends AppWithIdProps {
  developers: DeveloperProps[]
}


export interface AppWithIdProps extends AppDataProps{
  id: number;
}

export interface AppDataProps {
  appName: string,
  description: string,
  developers: Developer[],
  appLink: string,
  videoLink: string,
  github: string,
  type: string,
  technologies: string[],
  picture: string,
}

export interface AppInputProps {
  name: string;
  label: string;
  type: string;
  icon?: JSX.Element;
  placeholder?: string;
  register: any;
  error?: string;
  disabled?: boolean;
  }

export interface SignupInputProps{
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
  type:"submit" | "reset" | "button";
  text: string;
  slide_text: string;
  disabled: boolean;
  icon:JSX.Element;
}

export interface NavButtonProps {
  href: string;
  name: string;
  isSpecial?: boolean;
}