import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import registerImg from "@/assets/register.png";
import toast from "react-hot-toast";
import FormInput from "@/Common/FormInput";
import { NavLink, useNavigate } from "react-router-dom";
import { EyeClosedIcon, EyeOpenIcon } from "@/assets/icons/eye";
import Cookies from "js-cookie";
import api from "@/API/axiosInstance";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "@/Store/thunk";
import type { AppDispatch } from "@/Store/store";

const signUpSchema = z.object({
  email: z.email("Email is required"),
  password: z.string().nonempty("Password is required"),
  rememberME: z.boolean().optional()
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export function LogIn() {
  const { handleSubmit, control } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberME: false
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: SignUpFormData) => {
    const { email, password } = data;

    try {
      const response = await api.post(`/auth/v1/token?grant_type=password`, { email, password });

      //2. Collect The Required Data
      const { access_token, refresh_token, user } = response.data;

      if (!access_token || !user) {
        throw new Error("Missing Authentication Data!");
      }

      //3. Store The Collected Data Into Cookies
      if (data.rememberME) {
        Cookies.set("access_token", access_token, {
          expires: 7,
          secure: true,
          sameSite: "strict"
        });
        Cookies.set("refresh_token", refresh_token, {
          expires: 7,
          secure: true,
          sameSite: "strict"
        });
      } else {
        Cookies.set("access_token", access_token, {
          secure: true,
          sameSite: "strict"
        });
        Cookies.set("refresh_token", refresh_token, {
          secure: true,
          sameSite: "strict"
        });
      }

      const resultAction = await dispatch(getCurrentUser());

      if (getCurrentUser.fulfilled.match(resultAction)) {
        toast.success(`Welcome back ${user.user_metadata?.name}!`);
        navigate("/projects", { replace: true }); //, { replace: true } this prevent the user from going back to the login page after successful login by replacing the current entry in the history stack instead of adding a new one.
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error_description ||
        err.response?.data?.message ||
        "Email or Password is incorrect";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 md:grid-cols-2 bg-brightness-secondary">
      <div className="hidden md:flex justify-center items-center">
        <img src={registerImg} alt="Register" className="max-w-[80%] h-auto" />
      </div>

      <div className="flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md bg-brightness-primary p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold text-dark mb-2 text-center">Welcome Back!</h1>
          <p className="text-xs text-dark mb-6 text-center">
            Welcome back! Please enter your details.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <p className="text-gray-700 uppercase text-xs md:text-lg mb-1 font-semibold">Email</p>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <div>
                    <FormInput
                      label="yourname@company.com"
                      id="email"
                      type="email"
                      field={field}
                      error={fieldState.error}
                    />
                  </div>
                )}
              />
            </div>

            <div className="space-y-1">
              <span className="flex justify-between items-center">
                <p className="text-gray-700 uppercase text-xs md:text-lg font-semibold">Password</p>
                <NavLink
                  to="/forget-password"
                  className="text-sm text-gray-500 hover:text-gray-800 md:hidden block"
                >
                  Forgot?
                </NavLink>
              </span>
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <FormInput
                    label="Enter Your Password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    field={field}
                    error={fieldState.error}
                    icon={
                      <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                      </button>
                    }
                  />
                )}
              />
            </div>

            <div className="flex justify-between space-x-2">
              <Controller
                name="rememberME"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="rememberME"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="cursor-pointer"
                      />
                      <label htmlFor="rememberME" className="text-sm text-gray-500 cursor-pointer">
                        Remember me?
                      </label>
                    </div>
                  </div>
                )}
              />

              <NavLink
                to="/forget-password"
                className="text-sm text-gray-500 hover:text-gray-800 md:block hidden"
              >
                Forgot password?
              </NavLink>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-darkBlue text-white font-semibold py-2 rounded-lg hover:bg-dark transition-colors"
            >
              Log IN
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don’t have an account?
              <NavLink to="/signup" className="underline underline-offset-2 ms-2">
                Sign up for free
              </NavLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
