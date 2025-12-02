import express from 'express';
import mongoose from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import AssignmentsRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentsRoutes from './Kambaz/Enrollments/routes.js';
import session from "express-session";
import MongoStore from "connect-mongo";
import "dotenv/config";

// === DATABASE CONNECTION ===
const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING ||
  "mongodb://localhost:27017/Kambaz";

mongoose.connect(CONNECTION_STRING);

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
  console.log('Database name:', mongoose.connection.db.databaseName);
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// === EXPRESS APP ===
const app = express();

/* ============================================================
   CORS CONFIG (MUST BE BEFORE SESSION)
   ============================================================ */
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:3000",
        process.env.CLIENT_URL, // Your main Vercel domain
        "https://kambaz-next-js.vercel.app",
        /https:\/\/kambaz-next-js.*\.vercel\.app$/ // All preview URLs
      ];

      // Allow requests that have no origin (Dev tools, CURL, etc.)
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === "string") return origin === allowed;
        if (allowed instanceof RegExp) return allowed.test(origin);
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("Origin not allowed by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

app.use(express.json());

/* ============================================================
   SESSION CONFIG
   IMPORTANT FIXES:
   - secure: true
   - sameSite: "none"
   (Required for Vercel → Render cross-domain cookies)
   ============================================================ */
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "super secret session phrase",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: CONNECTION_STRING,
    dbName: "Kambaz",
    touchAfter: 24 * 3600
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: true,               // REQUIRED for cross-site cookies on HTTPS
    sameSite: "none"            // REQUIRED for cross-domain
  }
};

app.use(session(sessionOptions));

/* ============================================================
   ROUTES
   ============================================================ */
UserRoutes(app);
CourseRoutes(app);
ModulesRoutes(app);
AssignmentsRoutes(app);
EnrollmentsRoutes(app);
Lab5(app);
Hello(app);

/* ============================================================
   SERVER
   ============================================================ */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.SERVER_ENV}`);
  console.log(`Session cookie SameSite=None & Secure=True`);
});
