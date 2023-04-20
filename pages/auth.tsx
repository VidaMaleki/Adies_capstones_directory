import styles from '@/styles/auth.module.css';
import RegisterForm from '@/components/forms/Register';

export default function auth(){
    return(
        <div className={styles.authWrapper}>
            <div className={styles.authContainer}>
                <div className={styles.signUpWrapper}>
                    <div className={styles.signUpContainer}>
                        <h2 className={styles.signUpText}>Sign up</h2>
                        <p className={styles.signUpParagraph}>You already have an account ? &nbsp;
                        <a className={styles.signInHyperLink}>Sign in</a>
                        </p>
                        {/*---SIGN UP FORM---*/}
                        <RegisterForm/>
                    </div>
                </div>
            </div>
        </div>
    )
}