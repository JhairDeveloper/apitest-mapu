require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    url:
      process.env.DB_URL ||
      "mongodb+srv://grupo:9Q7MyHTMWKAstjBA@cluster0.mpdy2sr.mongodb.net/pis_ubicate",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "mayonesa12345",
    expiresIn: "5d",
  },
  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    user: process.env.EMAIL_USER || "viviana.calva@unl.edu.ec",
    password: process.env.EMAIL_PASSWORD,
  },
};
