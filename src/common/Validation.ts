const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

/**
 * Verify that a value is an email address
 *
 * @param email A value that should be an email address
 */
export function isValidEmail(email: any) {
  return emailRegex.test(String(email));
}
