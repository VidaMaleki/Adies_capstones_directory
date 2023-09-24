import * as React from "react";
import { useState } from "react";
import { IoAlertCircle } from "react-icons/io5";
import { AppInputProps } from "@/components/types";

const AppInput: React.FunctionComponent<AppInputProps> = (props) => {
  const { id, name, label, type, register, placeholder, onChange, error, value, disabled } = props;

  return (
    <div className={`mt-3 w-[100%] ${error ? 'border-red-500' : ''}`}>
      <label className="text-gray-700" htmlFor={name}>
        {label}
      </label>
      <div className="relative mt-1 rounded-md">
        <div
          className="pointer-event-none absolute left-0 top-0.5 inset-y-0 flex items-center pl-3"
          style={{ transform: `${error ? "translateY(-12PX)" : ""}` }}
        >
        </div>
        <input
          id={name}
          name={name}
          type={type}
          className={`w-full py-2 pr-7 pl-8 block rounded-md border border-gray-300 outline-offset-2 outline-transparent focus:border ${error ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          value={value}
          {...register(name)}
          style={{
            borderColor: `${error ? "#ED4337" : ""}`,
          }}
          onChange={onChange}
        />
        {error && (
          <div className="fill-red-500 absolute right-2 top-2.5 text-x1">
            <IoAlertCircle style={{ color: `#ED4337` }} />
          </div>
        )}
        {error && <p style={{ color: "#ED4337", marginTop: "1px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default AppInput;