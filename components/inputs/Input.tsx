import * as React from "react";
import {IoAlertCircle} from "react-icons/io5"
import styles from '@/styles/register.module.css';

interface IInputProps{
    name: string;
    label: string;
    type: string;
    icon: JSX.Element;
    placeholder: string;
    register: any;
    error: any;
    disabled: boolean;

}
const Input: React.FunctionComponent<IInputProps> = (props) => {
    const { name, label, type, icon, placeholder, register, error, disabled} = props;

    return(
        <div className={styles.inputWrapper}>
            <label className={styles.inputNameLabel} htmlFor={name}>{label}</label>
            <div className={styles.inputContainer}>
                <div className={styles.inputIconContainer} style={{transform: `${error ? "translateY(-10)": "" }`}}>
                    <span className={styles.inputIcon}>{icon}</span>
                </div>
                <input
                type={type}
                className={styles.inputName}
                placeholder={placeholder}
                {...register(name)}
                style={{
                    borderColor: `${error ? "#ED4337" : ""}`
                }}
                />
                {
                    error && 
                    (<div className={styles.inputError}>
                        <IoAlertCircle style={{color:`#ED4337`, }}/>
                    </div>
                )}
                {error && <p style={{color: "#ED4337", marginTop:"1px"}}>{error}</p>}
            </div>
        </div>
    );
};
export default Input;