import styles from '@/styles/auth.module.css';
import RegisterForm from '@/components/forms/Register';
import Background from '@/components/background/Background';
// npm install --save react-toastify


export default function auth(){
    return(
        <div className={styles.authWrapper}>
            <div className={styles.authContainer}>
                {/*---Form---*/}
                <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex items-center justify-center">
                    <div className="w-full px-12 py-4">
                        <h2 className="text-center text-2x1 font-bold tracking-wide text-gray-800">Sign up</h2>
                        <p className="text-center text-sm text-gray-600 mt-2">You already have an account ? &nbsp;
                        <a className="text-blue-600 hover:text-blue-700 hover:uderline cursor-pointer">Sign in</a>
                        </p>
                        {/*---SIGN UP FORM---*/}
                        <RegisterForm />
                    </div>
                </div>
                {/*---Background---*/}
                <Background image="../auth/adabg.png"/>
            </div>
        </div>
    )
}