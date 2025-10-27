require("dotenv").config();
const express = require("express");
const volleyball = require("volleyball");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const serverless = require("serverless-http");

const { auth, tasks } = require("./routes/index");
const { User } = require("./models");

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("DB connection error:", err));

// Middleware
app.use(express.json());
app.use(volleyball);
app.use(helmet());

// CORS handling for Vercel
app.use((req, res, next) => {
  const allowedOrigin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight
  }
  next();
});

// Passport Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.VERCEL_URL || "http://localhost:3000"}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName || `user_${profile.id.substring(0, 5)}`,
            email: profile.emails?.[0]?.value,
            avatarUrl:
              profile.photos?.[0]?.value ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            password: undefined,
          });
        }
        done(null, user);
      } catch (err) {
        console.error("GoogleStrategy error:", err);
        done(err, null);
      }
    }
  )
);

// Passport JWT Strategy
passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload._id);
        if (!user) return done(new Error("User not found"));
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/auth", auth);
app.use("/api/tasks", tasks);

// Export as serverless function for Vercel
module.exports = serverless(app);
