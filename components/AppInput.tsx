import { FC } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { GrTechnology } from 'react-icons/gr';
import { AppInputProps } from './types';


const AppInput: FC<AppInputProps> = ({
    name,
    label,
    type,
    icon,
    placeholder,
    register,
    error,
    disabled,
    }) => (
    <div>
        <label>
        {label} *
        {icon && <span>{icon}</span>}
        <input
            type={type}
            id={name}
            placeholder={placeholder}
            {...register(name)}
            disabled={disabled}
        />
        </label>
        {error && <p>{error}</p>}
    </div>
);

export default AppInput;