import express from "express";
import morgan from "morgan";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { fileURLToPath } from "url";

import routes from "./routes/routes.js";
import postes from "./routes/postes.js";
import { au } from "./auth/authentication.js";

const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/files'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
cloudinary.config({
  secure: true,
  cloud_name: 'dglqsxwon',
  api_key: '499835227724769',
  api_secret: 'qxdInVtC6A7MxSrdOO07ovwpGHo',
});

// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multer({
  storage: storage,
  dest: path.join(__dirname, 'public/files'),
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(null, false);
  }
}).single('img'));

// Global variables
app.use((req, res, next) => {
  next();
});

// Routes
app.use(routes);
app.use(postes);
app.use(au);

// Public
app.use(express.static(path.join(__dirname, "public")));

app.listen(app.get("port"));
console.log("SERVER IS LISTENING ON PORT", app.get("port"));