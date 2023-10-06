import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/styles/register.module.css";
import Input from "../inputs/Input";
import SlideButton from "../buttons/SlideButton";
import { AiFillLock } from "react-icons/ai";
import { FiLock } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { toast } from "react-toastify";
// import { Link } from 'react-router-dom';
import Link from "next/link";
import dotenv from "dotenv";

dotenv.config();

// npm install zod
// npm install @hookform/resolvers
// npm install @types/zxcvbn
// npm i axios
// npm install react-router-dom@latest

interface IResetFormProps {
  token: string;
}

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, "password must have at least 6 characters.")
      .max(30, "password must not be more than 30 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match!",
    path: ["confirmPassword"],
  });
type FormSchemaType = z.infer<typeof FormSchema>;

const validatePasswordStrength = (password: any) => {
  return zxcvbn(password ? password : "").score;
};

const ResetForm: React.FunctionComponent<IResetFormProps> = (props) => {
  const { token } = props;
  const [passwordScore, setPasswordScore] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });
  const reset_password = `${process.env.NEXT_PUBLIC_RESET}`;
  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    console.log(values);
    try {
      const { data } = await axios.post(reset_password, {
        password: values.password,
        token,
      });
      reset();
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  // const validatePasswordStrength = () => {
  //   let password = watch().password;
  //   return zxcvbn(password ? password : "").score;
  // };

  useEffect(() => {
    const password = watch().password;
    setPasswordScore(validatePasswordStrength(password));
  }, [watch, setPasswordScore]);

  return (
    <div className="w-full px-12 py-4">
      <h2 className="text-center text-2x1 font-bold tracking-wide text-gray-800">
        Reset password
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Sign in instead ? &nbsp;
        <Link
          href="/auth"
          className="text-blue-600 hover:text-blue-700 hover:uderline cursor-pointer"
        >
          Sign in
        </Link>
      </p>
      <form
        className={styles.registerWrapper}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="password"
          label="Password"
          type="password"
          icon={<AiFillLock />}
          placeholder="******"
          register={register}
          error={errors?.password?.message}
          disabled={isSubmitting}
        />
        {watch().password?.length > 0 && (
          <div className={styles.passwordScore}>
            {Array.from(Array(5).keys()).map((span, i) => (
              <span className={styles.passwordScoreSpan} key={i}>
                <div
                  className={styles.scores}
                  style={{
                    background: `${
                      passwordScore <= 2
                        ? "red"
                        : passwordScore < 4
                        ? "yellow"
                        : "green"
                    }`,
                  }}
                ></div>
              </span>
            ))}
          </div>
        )}
        <Input
          name="confirmPassword"
          label="Confirm password"
          type="password"
          icon={<AiFillLock />}
          placeholder="******"
          register={register}
          error={errors?.confirmPassword?.message}
          disabled={isSubmitting}
        />
        <SlideButton
          type="submit"
          text="Change password"
          slide_text="Secure"
          icon={<FiLock />}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};
export default ResetForm;
