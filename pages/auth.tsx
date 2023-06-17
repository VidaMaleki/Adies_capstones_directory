import styles from "@/styles/auth.module.css";
import RegisterForm from "@/components/SignIn/components/forms/Register";
import Background from "@/components/SignIn/components/background/Background";
import { NextPageContext } from "next";
import LoginForm from "@/components/SignIn/components/forms/Login";
import { getCsrfToken } from "next-auth/react";
import Navbar from "@/components/Navbar/Navbar";
// npm install --save react-toastify

export default function auth({
  tab,
  callbackUrl,
  csrfToken,
}: {
  tab: string;
  callbackUrl: string;
  csrfToken: string;
}) {
  return (
    <div className={styles.authWrapper}>
      <Navbar />
      <div className={styles.authContainer}>
        {/*---Forms---*/}
        <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex items-center justify-center">
          {tab == "signin" ? (
            <LoginForm callbackUrl={callbackUrl} csrfToken={csrfToken} />
          ) : (
            <RegisterForm />
          )}
        </div>
        {/*---Background---*/}
        <Background
          image={`"../auth/${tab == "signup" ? "signUp.png" : "signIn.png"}"`}
        />
      </div>
    </div>
  );
}
export async function getServerSideProps(ctx: NextPageContext) {
  const { req, query } = ctx;
  const tab = query.tab ? query.tab : "signin";
  const callbackUrl = query.callbackUrl
    ? query.callbackUrl
    : process.env.NEXTAUTH_URL;
  const csrfToken = await getCsrfToken(ctx);
  return {
    props: { tab: JSON.parse(JSON.stringify(tab)), callbackUrl, csrfToken },
  };
}
