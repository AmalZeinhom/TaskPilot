import React, { useEffect, useState } from "react";
import forgetPassword from "@/assets/forget-pass.png";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import FormInput from "@/Common/FormInput";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FaStopwatch, FaEnvelope } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const schema = z.object({
  email: z.email("Please enter a valid email address")
});

type FormData = z.infer<typeof schema>;

export function ForgetPassword() {
  const { handleSubmit, control } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [countDown, setCountDown] = useState(0);
  const [trials, setTrials] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (countDown > 0) {
      timer = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
    } else if (countDown === 0) {
      setDisabled(false); // After timer be finished, the button be enabled
    }
    return () => clearInterval(timer);
  }, [countDown]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  //When press the button
  const handleResend = async () => {
    if (trials >= 3) {
      toast.error("You have reached the maximum resend attemps!");
      setDisabled(true);
      return;
    }

    //Email Sending
    toast.success("If an account exists with this email, we’ve sent a password reset link.");

    setTrials((prev) => prev + 1);
    setCountDown(300);
    setDisabled(true);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: "http://localhost:5173/reset-password"
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("If an account exists with this email, a password reset link has been sent.");
    } catch (err: any) {
      const errorMessage = err.message || "Failed to send reset email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-brightness-primary md:p-10 p-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="rounded-md shadow-2xl flex flex-col md:flex-row items-center justify-center p-8 md:p-12 space-y-8 md:space-y-0 md:space-x-10 bg-brightness-secondary w-full max-w-4xl"
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.2 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img
            src={forgetPassword}
            alt="Forget Password"
            className="max-w-[85%] h-auto drop-shadow-lg hidden md:flex"
          />
        </motion.div>

        <div>
          <h1 className="md:text-3xl text-lg text-start font-semibold text-blue-950 mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-gray-500 md:text-sm text-xs mb-5 text-start">
            Enter your email address below, and we’ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field, fieldState }) => (
                <FormInput
                  label="Email"
                  id="email"
                  type="email"
                  field={field}
                  error={fieldState.error}
                />
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
              <button
                type="submit"
                disabled={loading || disabled}
                className={`bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2 rounded-xl font-medium transition-all ${
                  loading || disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg hover:scale-[1.02]"
                }`}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <button
                onClick={() => navigate("/login")}
                type="button"
                className="oborder border-gray-300 text-gray-600 py-2 rounded-xl hover:bg-gray-100 transition-all font-medium"
              >
                Back to Sign In
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResend}
                disabled={disabled}
                className={`text-sm font-medium transition-colors ${disabled ? "text-gray-400 cursor-not-allowed" : "text-blue-900 cursor-pointer hover:text-blue-700"}`}
              >
                {disabled ? (
                  <>
                    <FaStopwatch className="inline mr-1" /> Resend Email Will be available in
                    {formatTime(countDown)}
                  </>
                ) : (
                  <>
                    <FaEnvelope className="inline mr-1" /> Don’t receive an email? Resend
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
