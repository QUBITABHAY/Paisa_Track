import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./db.config.js";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.users.findUnique({
          where: { googleId: profile.id },
        });

        if (user) {
          return done(null, user);
        }

        user = await prisma.users.findUnique({
          where: { email: profile.emails[0].value },
        });

        if (user) {
          user = await prisma.users.update({
            where: { id: user.id },
            data: {
              googleId: profile.id,
              provider: "google",
              avatar: profile.photos[0]?.value || null,
              emailVerified: true,
            },
          });
          return done(null, user);
        }

        user = await prisma.users.create({
          data: {
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            avatar: profile.photos[0]?.value || null,
            provider: "google",
            emailVerified: true,
            password: null,
          },
        });

        done(null, user);
      } catch (error) {
        console.error("Google OAuth error:", error);
        done(error, null);
      }
    },
  ),
);

export default passport;
