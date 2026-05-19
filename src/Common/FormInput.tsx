import React from "react";
import { ControllerRenderProps, FieldError } from "react-hook-form";

interface FormInputProps {
  label?: string;
  id: string;
  type?: string;
  field: ControllerRenderProps<any, string>;
  error?: FieldError;
  icon?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({ label, id, type = "text", field, error, icon }) => {
  return (
    <div>
      <div className="relative w-full">
        <input
          id={id}
          placeholder={label}
          type={type}
          {...field}
          className="w-full bg-blue-formBlue rounded-md px-3 py-2 sm:px-4 sm:py-2 pr-10 text-sm sm:text-base"
        />

        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/3 md:top-1 md:translate-y-1 text-gray-400 cursor-pointer">
            {icon}
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs mt-1 text-left">{error.message}</p>}
    </div>
  );
};

export default FormInput;
