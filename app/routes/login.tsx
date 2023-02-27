import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect } from "~/utils/routing";
import { useEffect, useRef } from "react";
import H1 from "~/components/H1";
import Button from "~/components/Button";
import Link from "~/components/Link";
import Input from "~/components/Input";
import { badRequest } from "~/utils/error";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (typeof username !== "string" || username.length === 0) {
    return badRequest({
      username: "Email or username is invalid",
      password: null,
    });
  }

  if (typeof password !== "string" || password.length === 0) {
    return badRequest({ password: "Password is required", username: null });
  }

  const user = await verifyLogin(username, password);
  if (!user) {
    return badRequest({
      username: "Invalid email or username",
      password: null,
    });
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/user/self";
  const actionData = useActionData<typeof action>();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      noValidate
      className="w-full max-w-sm justify-self-center px-3 py-0 sm:self-center"
    >
      <H1>Log In</H1>

      <Input
        className="mt-4"
        label="Email address or username"
        id="username"
        type="email"
        autoComplete="email"
        autoFocus={true}
        ref={usernameRef}
        error={actionData?.errors?.username}
      />

      <Input
        className="mt-4"
        label="Password"
        id="password"
        type="password"
        autoComplete="password"
        autoFocus={true}
        ref={passwordRef}
        error={actionData?.errors?.password}
      />

      <input type="hidden" name="redirectTo" value={redirectTo} />

      <Button fullWidth={true} className="mt-6 mb-4">
        Log In
      </Button>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            defaultChecked={true}
          />
          <label
            htmlFor="remember"
            className="ml-2 block text-sm text-slate-900"
          >
            Remember me
          </label>
        </div>

        <div className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to={{
              pathname: "/signup",
              search: searchParams.toString(),
            }}
          >
            Sign up
          </Link>
        </div>
      </div>
    </Form>
  );
}
