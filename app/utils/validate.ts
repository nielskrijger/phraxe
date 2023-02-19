/**
 * Validates an email address according to the following requirements:
 * - The email address must not be empty.
 * - The email address must contain exactly one "@" symbol.
 * - The local part of the email address (before the "@") must not be empty and must not start or end with a ".".
 * - The domain part of the email address (after the "@") must not be empty, and must contain at least one ".".
 * - The domain must not end with a ".".
 *
 * Note that this validation is not perfect and may not catch all invalid email addresses.
 */
export function validateEmail(email: string): string | null {
  // Check if the email is empty
  if (email.length == 0) {
    return "Email is required";
  }

  // Check if the email contains exactly one "@" symbol
  const atIndex = email.indexOf("@");
  if (atIndex == -1 || atIndex != email.lastIndexOf("@")) {
    return "Email is invalid";
  }

  // Split the email into local and domain parts
  const [localPart, domainPart] = email.split("@");

  // Check the local part of the email address
  if (
    localPart.length == 0 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".")
  ) {
    return "Email is invalid";
  }

  // Check the domain part of the email address
  if (
    domainPart.length == 0 ||
    !domainPart.includes(".") ||
    domainPart.endsWith(".")
  ) {
    return "Email is invalid";
  }

  // If all checks pass, the email is valid
  return null;
}

const forbiddenUsernames = [
  /self/,
  /admin/,
  /superuser/,
  /moderator/,
  /fuck/,
  /dick/,
];

/**
 * Validates a username according to the following requirements:
 * - The username must not be empty.
 * - The username must be between 3 and 20 characters long.
 * - The username must start with a letter and contain only alphanumeric characters or underscores.
 * - The username must not contain any forbidden words, as specified in the `forbiddenUsernames` array.
 */
export function validateUsername(username: string): string | null {
  if (username.length === 0) {
    return "Username is required";
  }
  if (username.length < 3 || username.length > 20) {
    return "Username must be between 3 and 20 characters long";
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_]+$/.test(username)) {
    return "Username must begin with a letter and contain alphanumeric characters or _";
  }
  for (const regex of forbiddenUsernames) {
    if (regex.test(username)) {
      return `Username contains forbidden word "${regex.source}"`;
    }
  }
  return null;
}

/**
 * Validates a password according to the following requirements:
 * - The password must not be empty.
 * - The password must be at least 8 characters long.
 */
export function validatePassword(password: string): string | null {
  if (password.length === 0) {
    return "Password is required";
  }
  if (password.length < 8) {
    return "Password is too short";
  }
  return null;
}
