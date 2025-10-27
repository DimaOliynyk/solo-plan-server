require("dotenv").config();

const express = require("express");
const volleyball = require("volleyball");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();


const { auth } = require("./routes/ìndex")
const { tasks } = require("./routes/ìndex")

const { User } = require("./models");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => console.log(error));


app.use(express.json());
app.use(volleyball);
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(cors({ origin: "*", credentials: true }));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists in DB
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          username: profile.displayName || `user_${profile.id.substring(0,5)}`,
          email: profile.emails?.[0]?.value,
          avatarUrl: profile.photos?.[0]?.value || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
          password: undefined
        });
      }

      done(null, user);
    } catch (err) {
        console.error("GoogleStrategy error:", err);
        return done(err, null);
    }
  }
));


passport.use(
  new Strategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload._id);
        if (!user) {
          done(new Error("User not found"));
          return;
        }

        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);



app.use("/api/auth", auth);
app.use("/api/tasks", tasks);

app.listen(process.env.PORT, () => {
    console.log("Server Listening on PORT:", process.env.PORT);
});
module.exports = app;