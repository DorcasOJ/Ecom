export type userSignInType = {
  userId?: string;
  profileId?: string;
  email: string;
  firstName: string;
  lastName: string;
  access?: string;
  refresh?: string;
  isEmailVerified: boolean;
};
