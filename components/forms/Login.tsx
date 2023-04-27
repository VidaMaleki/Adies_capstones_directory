import * as React from 'react';
import axios from 'axios';
import styles from '@/styles/register.module.css';
import Input from '../inputs/Input';
import SlideButton from '../buttons/SlideButton';
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import {FiLock} from "react-icons/fi"
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
// npm install zod
// npm install @hookform/resolvers

interface ILoginFormProps{
}

const FormSchema=z.object({
    email: z
        .string().email("Please enter valid email address."),
    password: z
        .string()
        .min(6, "password must have at least 6 characters.")
        .max(30, "password must not be more than 30 characters."),
})
type FormSchemaType = z.infer<typeof FormSchema>;

const LoginForm: React.FunctionComponent<ILoginFormProps>=(props) => {
    const router = useRouter();
    const path = router.pathname
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmit:SubmitHandler<FormSchemaType>=async(values) =>{}
    
    return(
        <div className="w-full px-12 py-4">
            <h2 className="text-center text-2x1 font-bold tracking-wide text-gray-800">Sign in</h2>
            <p className="text-center text-sm text-gray-600 mt-2">You do not have an account ? &nbsp;
            <a className="text-blue-600 hover:text-blue-700 hover:uderline cursor-pointer"
            onClick={() =>{
                router.push({
                    pathname: path,
                    query: {
                        tab: 'signup',
                    }
                })
            }}>Sign up</a>
            </p>
            <form className={styles.registerWrapper} onSubmit={handleSubmit(onSubmit)}>
                <Input 
                    name="email"
                    label="Email"
                    type="text"
                    icon={<AiOutlineMail/>}
                    placeholder="example@example.com"
                    register={register}
                    error={errors?.email?.message}
                    disabled={isSubmitting}
                    />
                    <Input 
                    name="password"
                    label="Password"
                    type="text"
                    icon={<AiFillLock/>}
                    placeholder="******"
                    register={register}
                    error={errors?.password?.message}
                    disabled={isSubmitting}
                    />
                <SlideButton 
                type="submit"
                text="Sign in"
                slide_text="Secure sign in"
                icon={<FiLock/>}
                disabled={isSubmitting}
                />
                {/* <button onClick={() =>toast.success('This is a success message!')}>Toast</button> */}
            </form>
        </div>
    );
};
export default LoginForm;