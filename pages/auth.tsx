import styles from '@/styles/auth.module.css';
import RegisterForm from '@/components/forms/Register';
import Background from '@/components/background/Background';
import { NextPageContext } from 'next';
import LoginForm from '@/components/forms/Login';
// npm install --save react-toastify


export default function auth({tab}: {tab: string}){
    console.log(tab)
    return(
        <div className={styles.authWrapper}>
            <div className={styles.authContainer}>
                {/*---Forms---*/}
                <div className="w-full sm:w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/3 h-full bg-white flex items-center justify-center">
                    {tab=="signin"? <LoginForm/> : <RegisterForm />}
                </div>
                {/*---Background---*/}
                <Background image={`"../auth/${tab=="signup"? "adabg.png": "adabg.png"}"`}/>
            </div>
        </div>
    )
}
export async function getServerSideProps(ctx: NextPageContext){
    const {req, query} = ctx;
    const tab = query.tab ? query.tab: "signin";
    return {
        props: {tab:JSON.parse(JSON.stringify(tab))}
    }
}