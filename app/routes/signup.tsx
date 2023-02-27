import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import { createUserSession, getUserId } from "~/session.server";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
} from "~/models/user.server";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/utils/validate";
import { useEffect, useRef } from "react";
import H1 from "~/components/H1";
import Button from "~/components/Button";
import Link from "~/components/Link";
import Input from "~/components/Input";
import { safeRedirect } from "~/utils/routing";
import { badRequest } from "~/utils/error";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const errors = {
    email: null as null | string,
    password: null as null | string,
    username: null as null | string,
  };
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  } else if (await getUserByEmail(email)) {
    errors.email = "A user already exists with this email address";
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
  } else if (await getUserByUsername(username)) {
    errors.username = "This username is already in use";
  }

  if (Object.values(errors).some((e) => e !== null)) {
    return badRequest(errors);
  }

  const user = await createUser(email, username, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Signup() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      className="w-full max-w-sm justify-self-center px-3 py-0 sm:self-center"
      noValidate
    >
      <H1>Sign Up</H1>

      <p className="font-serif">
        Create a free account to track your favorite idioms, sayings, jokes and
        quotes!
      </p>

      <Input
        className="mt-4"
        label="Email address"
        id="email"
        type="email"
        autoComplete="email"
        autoFocus={true}
        ref={emailRef}
        error={actionData?.errors?.email}
      />

      <Input
        className="mt-4"
        label="Username"
        id="username"
        autoComplete="username"
        ref={usernameRef}
        error={actionData?.errors?.username}
      />

      <Input
        className="mt-4"
        label="Password"
        id="password"
        autoComplete="password"
        type="password"
        ref={passwordRef}
        error={actionData?.errors?.password}
      />

      <input type="hidden" name="redirectTo" value={redirectTo} />

      <Button fullWidth={true} className="mt-6 mb-4">
        Create Account
      </Button>

      <div className="flex items-center justify-center">
        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to={{
              pathname: "/login",
              search: searchParams.toString(),
            }}
          >
            Log in
          </Link>
        </div>
      </div>
    </Form>
  );
}
