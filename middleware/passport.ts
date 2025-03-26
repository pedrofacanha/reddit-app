import passport from "passport";
import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (
    uname: string, 
    password: string, 
    done: (error: any, user?: Express.User | false, options?: IVerifyOptions) => void
  ) => 
      {
    // Check if user exists in databse
    const user = await getUserByEmailIdAndPassword(uname, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
  }
);

// creates a session for our user
passport.serializeUser(function (user: Express.User, done: (err: any, id?: number) => void) {
  // stores the session in the session store with user.id
  done(null, user.id); 
});

// ⭐ TODO: Passport Types
passport.deserializeUser(async function (id: number, done: (err: any, user?: Express.User | false | null) => void) {
  const user = await getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

export default passport.use(localLogin);
