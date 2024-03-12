const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = express.Router();
const saltRounds = 10;
const secretKey = "SAJKDHASJKDHAjsdahnasd!@#!@asdjkabJBAS"; //local secert key
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const { rateLimit } = require("express-rate-limit");
// Home page route.

const authLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	limit: 30, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message: "You've exceeded the regular amount of requests kindly wait and try again after 1 hour.",
	standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (req, file, cb) => {
		const originalname = `${uuidv4()}.jpg`;
		cb(null, originalname);
	},
});
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter: (req, file, cb) => {
		if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
		}
	},
});

auth.post("/signup", authLimiter, upload.single("profilePicture"), async (req, res) => {
	try {
		const request = req.body;
		const { username, email, password, phoneNumber } = request;
		//fs.chmodSync(req.file.path, "0644");
		// Check if username, email, and phonenumber are not empty
		if (!username || !email || !phoneNumber || req.file == undefined) {
			return res.status(400).send({ response: "error", errorMessage: "Username, email, and phone number and file are required fields" });
		}

		let hashedPassword = await bcrypt.hash(password, saltRounds);
		const user = await prisma.user.create({
			data: {
				username: username,
				email: email,
				password: hashedPassword,
				phoneNumber: phoneNumber,
				profilePicture: req.file.filename, // Save the file's generated filename to the database
			},
		});
		res.status(200).send({ response: "ok" });
	} catch (e) {
		if (e instanceof Prisma.PrismaClientKnownRequestError) {
			if (e.code === "P2002") {
				if (e.meta.target == "User_phoneNumber_key") {
					// if phoneNumber is found in DB
					res.status(400).send({ response: "error", errorMessage: " Phone number is linked to another account" });
				} else if (e.meta.target == "User_username_key") {
					// if username is found in DB
					res.status(400).send({ response: "error", errorMessage: "Username is linked to another account" });
				} else if (e.meta.target == "User_email_key") {
					// if email is found in DB
					res.status(400).send({ response: "error", errorMessage: "Email is linked to another account" });
				}
			}
		} else {
			console.log(e);
			res.status(400).send({ response: "error", errorMessage: "Server error happened when trying to signup" });
		}
	}
});

auth.post("/login", authLimiter, async (req, res) => {
	try {
		const request = req.body;

		let token = "";
		const getUser = await prisma.user.findUnique({
			where: {
				username: request.userName,
			},
		});
		if (getUser == null) {
			return res.status(400).json({ success: false, message: "account does not exist" }); // handle if the account doesnt exist
		}
		bcrypt.compare(request.password, getUser.password, async function (err, result) {
			if (err) {
				return res.status(400).json({ success: false, message: "server error happened" });
			}
			if (result) {
				const userWithoutPassword = exclude(getUser, ["password"]);
				const username = getUser.username;
				if (getUser.admin == true) {
					token = jwt.sign({ id: userWithoutPassword.id, username: username, admin: true }, secretKey, { expiresIn: "3h" });
				} else {
					token = jwt.sign({ id: userWithoutPassword.id, username: username }, secretKey, { expiresIn: "3h" });
				}
				return res.status(200).json({ success: true, message: "logged in", user: userWithoutPassword, token: token });
			} else {
				// response is OutgoingMessage object that server response http request
				return res.status(400).json({ success: false, message: "passwords do not match" });
			}
		});
	} catch (e) {
		console.log(e);
		return res.status(400).json({ success: false, message: "Server Error when login" });
	}
});
function exclude(user, keys) {
	return Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key)));
}
module.exports = auth;
