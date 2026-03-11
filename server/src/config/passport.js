// server/config/passport.js
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// ✅ Change this path if your user model file name/path is different
const User = require("../models/User");

function initPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,         // ✅ matches .env
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // ✅ matches .env
        callbackURL: process.env.GOOGLE_CALLBACK_URL,   // ✅ matches .env
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile?.emails?.[0]?.value?.toLowerCase();
          const googleId = profile?.id;

          if (!email) return done(new Error("Google account has no email"), null);

          // Find by email or googleId
          let user = await User.findOne({ $or: [{ email }, { googleId }] });

          if (!user) {
            // Create new user in MongoDB
            user = await User.create({
              email,
              googleId,
              firstName: profile?.name?.givenName || "",
              lastName: profile?.name?.familyName || "",
              role: "user",
              avatar: profile?.photos?.[0]?.value || "",
            });
          } else {
            // Link googleId if same email user exists
            if (!user.googleId) user.googleId = googleId;
            if (!user.avatar && profile?.photos?.[0]?.value) user.avatar = profile.photos[0].value;
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // Only needed if we use sessions (we will in Step 2)
  passport.serializeUser((user, done) => done(null, user._id.toString()));
  passport.deserializeUser(async (id, done) => {
    try {
      const u = await User.findById(id).select("-password");
      done(null, u);
    } catch (e) {
      done(e, null);
    }
  });
}

module.exports = initPassport;