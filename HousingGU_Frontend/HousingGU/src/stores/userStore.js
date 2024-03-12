import { defineStore } from "pinia";
import { watch, ref } from "vue";
import axios from "axios";
const userCred = "userCred";
export const userStore = defineStore("userStore", () => {
	const userName = ref("Sign In");
	const isAdmin = ref(false);
	const loggedIn = ref(false);
	const email = ref("");
	const phoneNumber = ref("");
	const token = ref("");
	const profilePicture = ref("");
	setUserFromStorage();

	function setUserInfo(name, isAdminBool, givenEmail, phone, JWTtoken, givenProfilePicturePath) {
		let checkUserInfo = localStorage.getItem(userCred);
		if (checkUserInfo === null || checkUserInfo === undefined || checkUserInfo === "null") {
			userName.value = name;
			email.value = givenEmail;
			isAdmin.value = isAdminBool;
			loggedIn.value = true;
			phoneNumber.value = phone;
			token.value = JWTtoken;
			profilePicture.value = givenProfilePicturePath;
			axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
			localStorage.setItem(userCred, JSON.stringify(userInfo()));
		} else {
			let userInfoInStorage = JSON.parse(checkUserInfo); // TOdo check for Local Storage
		}
	}
	function setUserFromStorage() {
		//get user if logged in before refresh
		let checkUserInfo = localStorage.getItem(userCred);
		if (checkUserInfo === null || checkUserInfo === undefined || checkUserInfo === "null") {
			return;
		} else if (checkUserInfo != null) {
			let userInfoInStorage = JSON.parse(checkUserInfo);
			userName.value = userInfoInStorage.userName;
			email.value = userInfoInStorage.email;
			isAdmin.value = userInfoInStorage.isAdmin;
			loggedIn.value = userInfoInStorage.loggedIn;
			phoneNumber.value = userInfoInStorage.phoneNumber;
			token.value = userInfoInStorage.token;
			profilePicture.value = userInfoInStorage.profilePicture;
			axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
		}
	}

	function logOutUser() {
		localStorage.setItem(userCred, null);
		localStorage.removeItem(userCred);
		userName.value = "Sign In";
		isAdmin.value = false;
		loggedIn.value = false;
		email.value = "";
		phoneNumber.value = "";
		token.value = "";
		profilePicture.value = "";
		axios.defaults.headers.common["Authorization"] = `Bearer `;
	}

	function userInfo() {
		let userCred = {
			userName: userName.value,
			isAdmin: isAdmin.value,
			phoneNumber: phoneNumber.value,
			email: email.value,
			loggedIn: loggedIn.value,
			token: token.value,
			profilePicture: profilePicture.value,
		};
		return userCred;
	}

	return { userName, isAdmin, loggedIn, email, phoneNumber, token, profilePicture, setUserInfo, setUserFromStorage, logOutUser, userInfo };
});
