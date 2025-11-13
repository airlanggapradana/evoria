"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type LoginInput, loginSchema } from "@/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLogin } from "@/utils/query";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();
  const form = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const { mutateAsync: handleLogin, isPending } = useLogin();

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      const res = await handleLogin(data);
      if (res) {
        toast.success("Login successfully", {
          position: "top-center",
          richColors: true,
        });
        form.reset();
        router.push("/");
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message, {
          position: "top-center",
          richColors: true,
        });
      }
    }
  };
  return (
    <main
      className={
        "relative z-10 flex min-h-screen w-full items-center justify-center px-5"
      }
    >
      <Card className="dark w-full max-w-xl">
        <CardHeader>
          <CardTitle>Login Akun</CardTitle>
          <CardDescription>
            Masuk ke akunmu dan lanjutkan perjalananmu bersama kami!
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("sign-up")}>
              Sign Up
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={"space-y-3"}
            >
              <Controller
                control={form.control}
                name={"email"}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Masukkan email"
                      aria-invalid={fieldState.invalid}
                      type="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name={"password"}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Masukkan password"
                      aria-invalid={fieldState.invalid}
                      type="password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button
                type="submit"
                className="mt-5 w-full"
                disabled={isPending}
              >
                {isPending ? "Mengecek..." : "Login"}
              </Button>
            </form>
          </FieldGroup>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
