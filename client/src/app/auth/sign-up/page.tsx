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
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RegisterInput, registerSchema } from "@/zod/schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRegister } from "@/utils/query";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    defaultValues: {
      name: "",
      role: "USER",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const { mutateAsync: handleRegister, isPending } = useRegister();

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      const res = await handleRegister(data);
      if (res === 201) {
        toast.success("Registrasi berhasil! Silakan login.", {
          position: "top-center",
          richColors: true,
        });
        form.reset();
        router.push("sign-in");
      }
    } catch (e) {
      if (e instanceof Error) {
        toast.error(`Registrasi gagal: ${e.message}`, {
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
          <CardTitle>Buat Akun Baru</CardTitle>
          <CardDescription>
            Daftar sekarang dan mulai perjalanan Anda bersama kami!
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("sign-in")}>
              Sign In
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
                name={"name"}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Masukkan nama lengkap"
                      aria-invalid={fieldState.invalid}
                      type="text"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
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
                name={"role"}
                render={({ field: { onChange, ...field }, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select {...field} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                      <SelectContent className={"dark"}>
                        <SelectItem value={"USER"}>User</SelectItem>
                        <SelectItem value={"ORGANIZER"}>Organizer</SelectItem>
                      </SelectContent>
                    </Select>
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
              <Controller
                control={form.control}
                name={"confirmPassword"}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Confirm Password
                    </FieldLabel>
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
                {isPending ? "Mendaftarkan..." : "Daftar Sekarang"}
              </Button>
            </form>
          </FieldGroup>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignUpPage;
