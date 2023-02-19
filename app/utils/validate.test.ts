import { validateEmail, validatePassword, validateUsername } from "./validate";
import { expect, describe, it } from "vitest";

describe("validateEmail", () => {
  it("returns an error message when the email is empty", () => {
    expect(validateEmail("")).toBe("Email is required");
  });

  it("returns an error message when the email is invalid", () => {
    expect(validateEmail("user@example")).toBe("Email is invalid");
    expect(validateEmail("user@example.")).toBe("Email is invalid");
    expect(validateEmail(".user@example.com")).toBe("Email is invalid");
    expect(validateEmail("user.@example.com")).toBe("Email is invalid");
    expect(validateEmail("user@example.com.")).toBe("Email is invalid");
  });

  it("returns null when the email is valid", () => {
    expect(validateEmail("user@example.com")).toBe(null);
    expect(validateEmail("user123@gmail.com")).toBe(null);
    expect(validateEmail("user.name@example.co.uk")).toBe(null);
    expect(validateEmail("user.example@example.com")).toBe(null);
  });
});

describe("validateUsername", () => {
  it("returns an error message when the username is empty", () => {
    expect(validateUsername("")).toBe("Username is required");
  });

  it("returns an error message when the username is too short or too long", () => {
    expect(validateUsername("ab")).toBe(
      "Username must be between 3 and 20 characters long"
    );
    expect(validateUsername("abcdefghijklmnopqrstuvwxy")).toBe(
      "Username must be between 3 and 20 characters long"
    );
  });

  it("returns an error message when the username contains invalid characters", () => {
    expect(validateUsername("1username")).toBe(
      "Username must begin with a letter and contain alphanumeric characters or _"
    );
    expect(validateUsername("user name")).toBe(
      "Username must begin with a letter and contain alphanumeric characters or _"
    );
  });

  it("returns an error message when the username contains forbidden words", () => {
    expect(validateUsername("admin123")).toBe(
      'Username contains forbidden word "admin"'
    );
    expect(validateUsername("superuser567")).toBe(
      'Username contains forbidden word "superuser"'
    );
  });

  it("returns null when the username is valid", () => {
    expect(validateUsername("valid_username")).toBe(null);
    expect(validateUsername("a1_b2_c3")).toBe(null);
  });
});

describe("validatePassword", () => {
  it("returns an error message when the password is empty", () => {
    expect(validatePassword("")).toBe("Password is required");
  });

  it("returns an error message when the password is too short", () => {
    expect(validatePassword("pass")).toBe("Password is too short");
    expect(validatePassword("1234567")).toBe("Password is too short");
  });

  it("returns null when the password is valid", () => {
    expect(validatePassword("password")).toBe(null);
    expect(validatePassword("password123")).toBe(null);
    expect(validatePassword("longpassword")).toBe(null);
  });
});
