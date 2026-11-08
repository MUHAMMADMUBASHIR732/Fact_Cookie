// Password rules shown on sign-up and checked before submitting.
export const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One capital letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One special character (for example ! @ # $)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export const passwordIsStrong = (p: string) => passwordRules.every((r) => r.test(p));
