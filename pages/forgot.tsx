import Background from "@/components/SignIn/components/background/Background";
import ForgotForm from "@/components/SignIn/components/forms/Forgot";
import Navbar from "@/components/Navbar/Navbar";
import styles from "@/styles/auth.module.css";

// npm install --save react-toastify

export default function auth() {
  return (
    <div className={styles.authWrapper}>
      <Navbar />
      <div className={styles.authContainer}>
        {/*---Form---- */}
        <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex items-center justify-center">
          <ForgotForm />
        </div>
        {/*---Background---*/}
        <Background image={`"../auth/forgot.png"`} />
      </div>
    </div>
  );
}
