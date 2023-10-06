import * as React from "react";
import axios from "axios";
import styles from "@/styles/register.module.css";
import Input from "../inputs/Input";
import SlideButton from "../buttons/SlideButton";
import { AiOutlineMail, AiFillLock } from "react-icons/ai";
import { FiLock } from "react-icons/fi";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import Link from "next/link";
import dotenv from "dotenv";

dotenv.config();
// npm install zod
// npm install @hookform/resolvers

interface IForgotFormProps {}

const FormSchema = z.object({
  email: z.string().email("Please enter valid email address."),
});
type FormSchemaType = z.infer<typeof FormSchema>;

const ForgotForm: React.FunctionComponent<IForgotFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });
  const forgot_password = `${process.env.NEXT_PUBLIC_FORGOT}`;
  const onSubmit: SubmitHandler<FormSchemaType> = async (values) => {
    try {
      const { data } = await axios.post(forgot_password, {
        email: values.email,
      });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full px-12 py-4">
      <h2 className="text-center text-2x1 font-bold tracking-wide text-gray-800">
        Forgot password
      </h2>
      <p className="text-center text-sm text-gray-600 mt-2">
        Sign in instead ?&nbsp;
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
          name="email"
          label="Email"
          type="text"
          icon={<AiOutlineMail />}
          placeholder="example@example.com"
          register={register}
          error={errors?.email?.message}
          disabled={isSubmitting}
        />
        <SlideButton
          type="submit"
          text="Send email"
          slide_text="Secure "
          icon={<FiLock />}
          disabled={isSubmitting}
        />
      </form>
    </div>
  );
};
export default ForgotForm;
