import path from "path";
import express from "express";
import exphbs from "express-handlebars";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import session from "express-session";
import Handlebars from "handlebars";
import paginate from "express-paginate";
import fileUpload from "express-fileupload";
const app = express();

import bodyParser from "body-parser";
import mongoose from "mongoose";
import route from "./routes/";

mongoose.connect(
  "mongodb://localhost:27017/university-app", {
    useNewUrlParser: true
  }
);

mongoose.Promise = global.Promise;

// Helper function to increment index value for foreach loop.
Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

// Helper to format date
Handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

Handlebars.registerHelper("if_equal", function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(fileUpload());

app.use(cookieParser());
app.use(
  session({
    cookie: {
      maxAge: 3600000000
    },
    secret: "my_secret",
    saveUninitialized: false,
    resave: false
  })
);

app.use(flash());
app.use((req, res, next) => {
  res.locals.success_message = req.flash("success");
  res.locals.error_message = req.flash("error");
  res.locals.detailed_message = req.flash("detailed_msg");
  res.locals.session = req.session.user;
  next();
});

app.use(paginate.middleware(10, 50));

app.use("/", route);

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main.handlebars",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials/includes"
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname, "public")));

const port = process.env.port || 3000;
app.listen(3000, () => console.log(`App is running at ${port}`));