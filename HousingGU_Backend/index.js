const express = require("express");
const { PrismaClient } = require("@prisma/client");
const session = require("express-session");
const cors = require("cors");
const app = express();
const port = 5555;
const secretKey = "SAJKDHASJKDHAjsdahnasd!@#!@asdjkabJBAS";
const jwt = require("jsonwebtoken");
require("./routes/chating");

require("./routes/createUsers"); // will create users if database is empty
const allowedOrigins = ["http://localhost:5173", "http://89.116.167.130:5173"];

app.use(
	cors({
		origin: function (origin, callback) {
			// Allow the request if the origin is allowed or it's not specified (like with mobile apps)
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	})
);
app.use("/uploads", express.static("uploads"));
app.use(express.json()); // makes every HTTP request A JSON Object
app.use(function (req, res, next) {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Content-Security-Policy-Report-Only", "default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self'; frame-src 'self'");
	next();
});
app.use("/user/*", function authenticateToken(req, res, next) {
	//middleware to check for JWT with /user/anycall path
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (!token) {
		return res.status(401).send("unauthorized");
	}

	jwt.verify(token, secretKey, (err, user) => {
		if (err) {
			return res.status(401).send("invalid token");
		}
		req.user = user;
		next();
	});
});

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const landlordRoute = require("./routes/landlord");
app.use(authRoute);
app.use(userRoute);
app.use(landlordRoute);
app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});

app.get("/", (req, res) => {
	res.send({ response: "ok", Message: "HousingU home" });
});

app.get("/user/checkToken", (req, res) => {
	res.send({ response: "ok", Message: `You have a token for user ${req.user.username}` }); // Test for token
});
