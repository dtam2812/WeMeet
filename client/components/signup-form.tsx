"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { api } from "@/common";
import axios from "axios";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .pipe(
        z
          .string()
          .trim()
          .min(5, { message: "Name must be at least 5 characters" }),
      )
      .pipe(
        z
          .string()
          .trim()
          .min(5, { message: "Name must be at least 5 characters" })
          .regex(/^[^\d]*$/, { message: "Name must not contain numbers" }),
      ),
    email: z.email({ message: "Invalid email address" }),
    password: z
      .string()
      .trim()
      .min(1, { message: "Password is required" })
      .pipe(
        z
          .string()
          .trim()
          .min(5, { message: "Password must be at least 5 characters" }),
      ),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormSignUpData = {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, isLoading },
  } = useForm<FormSignUpData>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: FormSignUpData) => {
    setServerError(null);

    try {
      await api.post("/user/sign-up", {
        name: data.userName,
        email: data.email,
        password: data.password,
      });

      router.push("/sign-in");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setServerError(
          Array.isArray(message)
            ? message[0]
            : message || "Something went wrong. Please try again.",
        );
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 lg:grid-cols-3">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-muted-foreground">
                  Create your first WeMeet account
                </p>
              </div>
              <FieldGroup>
                <Field data-invalid={!!errors.userName}>
                  <FieldLabel htmlFor="userName">Full Name</FieldLabel>
                  <Input
                    id="userName"
                    placeholder="John Doe"
                    {...register("userName")}
                    aria-invalid={!!errors.userName}
                  />
                  <p className="text-sm text-red-500 h-1 leading-5">
                    {errors.userName?.message}
                  </p>
                </Field>
                <Field data-invalid={!!errors.email}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                  />
                  <p className="text-sm text-red-500 h-1 leading-5">
                    {errors.email?.message}
                  </p>
                </Field>

                <Field data-invalid={!!errors.password}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                  />
                  <p className="text-sm text-red-500 h-1 leading-5">
                    {errors.password?.message}
                  </p>
                </Field>
                <Field data-invalid={!!errors.confirmPassword}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <p className="text-sm text-red-500 h-1 leading-5">
                    {errors.confirmPassword?.message}
                  </p>
                </Field>

                {serverError && (
                  <p className="text-sm text-red-500 text-center">
                    {serverError}
                  </p>
                )}

                <Field>
                  <Button type="submit" disabled={isSubmitting || !isValid}>
                    {isSubmitting ? "Creating..." : "Create Account"}
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <a href="/sign-in">Sign in</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <Field className="mx-auto ">
                <Button variant="outline" type="button">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Google</span>
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted lg:block lg:col-span-2">
            <img
              src="/images/banner.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            <div className="absolute ">
              <Link className="flex p-3" href="/">
                <Image
                  src="/icons//logo.svg"
                  width={32}
                  height={32}
                  alt="WeMeet Logo"
                  className="max-sm:size-10"
                />
                <p className="text-[26px] font-extrabold max-sm:hidden">
                  WeMeet
                </p>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
