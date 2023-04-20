import * as React from 'react';
import styles from '@/styles/register.module.css';
import Input from '../inputs/Input';
import { CiUser } from "react-icons/ci";
import {useForm} from "react-hook-form";
import {z} from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
// npm install zod
// npm install @hookform/resolvers

interface IRegisterFormProps{
}

const FormSchema=z.object({
    fullName: z
    .string()
    .min(2, "Full name must have at least 2 characters")
    .max(32, "Full name must be less than 32 characters")
    .regex(new RegExp("^[a-zA-z]+$"), "No special characters allowed."),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const RegisterForm: React.FunctionComponent<IRegisterFormProps>=(props) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema)
    });

    const onSubmit = (data: any) => console.log(data);

    return(
        <form className={styles.registerWrapper} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.RegisterContainer}>
                <Input 
                name="fullName"
                label="Full name"
                type="text"
                icon={<CiUser/>}
                placeholder="Vida Maleki"
                register={register}
                error={errors?.fullName?.message}
                disabled={isSubmitting}
                />
                <button type="submit">Submit</button>
            </div>
        </form>
    );
};
export default RegisterForm;