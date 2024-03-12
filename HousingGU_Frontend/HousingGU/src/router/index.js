import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "../views/landingPage.vue";
import login from "../views/login.vue";
import register from "../views/register.vue";
import roomatePreference from "../views/roomatePreference.vue";
import Profile from "../views/Profile.vue";
import { userStore } from "../stores/userStore";
import Chat from "../views/chat.vue";
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/:catchAll(.*)", // No match found for location with path
			name: "landingPage",
			meta: { guest: true },
			component: LandingPage,
		},
		{
			path: "/login", // No match found for location with path
			name: "login",
			meta: { guest: true },
			component: login,
		},
		{
			path: "/register", // No match found for location with path
			name: "register",
			meta: { guest: true },
			component: register,
		},
		{
			path: "/roomatePreference", // No match found for location with path
			name: "roomatePreference",
			meta: { guest: false },
			component: roomatePreference,
		},
		{
			path: "/profile", // No match found for location with path
			name: "Profile",
			meta: { guest: false },
			component: Profile,
		},
		{
			path: "/chat/:friendId",
			name: "Chat",
			meta: { guest: false },
			component: Chat,
		},
	],
});

router.beforeEach((to, from, next) => {
	if (to.meta.guest == false) {
		// check if use already logged
		// if true then go to home
		const userInfo = userStore();
		if (userInfo.loggedIn == false) {
			return next({ path: "/" }); // '/' is home page for example
		} else {
			return next();
		}

		// else then continue to next()
	} else {
		return next();
	}
});

export default router;
