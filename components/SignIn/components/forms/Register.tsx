import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "@/styles/register.module.css";
import Input from "../inputs/Input";
import SlideButton from "../buttons/SlideButton";
import { CiUser } from "react-icons/ci";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import { IoSchoolSharp } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import { FiLock } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { toast } from "react-toastify";
// import { Link } from 'react-router-dom';
import Link from "next/link";
// import authorizedEmails from '../../data/developers.json'
// npm install zod
// npm install @hookform/resolvers
// npm install @types/zxcvbn
// npm i axios
// npm install react-router-dom@latest

interface IRegisterFormProps {}

const FormSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must have at least 2 characters.")
      .max(32, "Full name must not be more than 32 characters.")
      .regex(new RegExp("^[a-zA-Z\\s]+$"), "No special characters allowed."),
    email: z.string().email("Please enter valid email address."),
    cohort: z
      .string() // change to z.number()
      .min(1, "Cohort must have at least one digit.")
      .max(3, "cohort must not be less than 3 digits.")
      .refine((value) => /^[0-9]+$/.test(value), {
        message: "Cohort must contain only digits.",
      }),
    linkedin: z.string().url("Link must be valid link."),
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

const RegisterForm: React.FunctionComponent<IRegisterFormProps> = (props) => {
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

  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    console.log(values);
    // const { email } = values;

    // Check if the entered email is in the list of authorized emails
    // const isAuthorized = authorizedEmails.authorizedEmails.some(
    // (authorizedEmail) => authorizedEmail.email === email
    // );

    try {
      const { data } = await axios.post("/api/auth/signup", {
        ...values,
      });
      reset();
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const validatePasswordStrength = () => {
    let password = watch().password;
    return zxcvbn(password ? password : "").score;
  };
  const password = watch().password;
  useEffect(() => {
    setPasswordScore(validatePasswordStrength());
  }, [password]);

  return (
    <div className="w-full px-12 py-4">
      <h2 className="text-center text-2x1 font-bold tracking-wide text-gray-800">
        Sign up
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        You already have an account ? &nbsp;
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
        <div className={styles.RegisterContainer}>
          <Input
            name="fullName"
            label="Full name"
            type="text"
            icon={<CiUser />}
            placeholder="example"
            register={register}
            error={errors?.fullName?.message}
            disabled={isSubmitting}
          />
        </div>
        <Input
          name="email"
          label="Email"
          type="text"
          icon={<AiOutlineMail />}
          placeholder="example@example.com"
          register={register}
          error={errors?.email?.message}
          disabled={isSubmitting}
        />
        <Input
          name="cohort"
          label="Cohort"
          type="number"
          icon={<IoSchoolSharp />}
          placeholder="17"
          register={register}
          error={errors?.cohort?.message}
          disabled={isSubmitting}
        />
        <Input
          name="linkedin"
          label="Linkedin URL"
          type="text"
          icon={<FaLinkedinIn />}
          placeholder="https://www.linkedin.com/"
          register={register}
          error={errors?.linkedin?.message}
          disabled={isSubmitting}
        />
        <Input
          name="password"
          label="Password"
          type="text"
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
          type="text"
          icon={<AiFillLock />}
          placeholder="******"
          register={register}
          error={errors?.confirmPassword?.message}
          disabled={isSubmitting}
        />
        <SlideButton
          type="submit"
          text="Sign up"
          slide_text="Secure sign up"
          icon={<FiLock />}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};
export default RegisterForm;
