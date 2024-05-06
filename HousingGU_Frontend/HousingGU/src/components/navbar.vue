<template>
	<header>
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
			<div class="container-fluid">
				<router-link class="navbar-brand" to="/">
					<img src="../assets/img/logo.png" style="width: 7em; height: 2.3em" />
				</router-link>
				<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav me-auto">
						<li class="nav-item">
							<router-link class="nav-link" to="/"><i class="bi bi-house-door sp-icon"></i> Home</router-link>
						</li>
						<li class="nav-item" v-if="userInfo.loggedIn == true && userInfo.type == 'Roomie' && userInfo.IsPreferenceFilled == true">
							<router-link class="nav-link" to="/roomieSearch"><i class="bi bi-search sp-icon"></i> Search for Roomie</router-link>
						</li>
						<li class="nav-item" v-if="(userInfo.loggedIn == true && userInfo.type == 'Landlord') || (userInfo.type == 'Roomie' && userInfo.IsPreferenceFilled == true)">
							<router-link class="nav-link" to="/profile"><i class="bi bi-chat-dots sp-icon"></i> Chat</router-link>
						</li>
						<li class="nav-item" v-if="userInfo.loggedIn == true">
							<router-link class="nav-link" to="/rooms"><i class="bi bi-houses sp-icon"></i> Rooms</router-link>
						</li>
					</ul>
					<ul class="navbar-nav">
						<div class="dropdown" v-if="userInfo.loggedIn == true">
							<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i class="bi bi-person-fill sp-icon"></i>{{ userInfo.userName }}</button>
							<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
								<li>
									<router-link class="nav-link" to="/profile" v-if="userInfo.IsPreferenceFilled || userInfo.type == 'Roomie'"> User Profile</router-link>
									<router-link class="nav-link" to="/landlord-profile" v-if="userInfo.type == 'Landlord'"> User Profile</router-link>
									<router-link class="nav-link" to="/roomatePreference" v-if="userInfo.IsPreferenceFilled == false && userInfo.type == 'Roomie'"> Preference</router-link>
								</li>
								<li>
									<button class="nav-link" @click="logout()">logout</button>
								</li>
							</ul>
						</div>
						<li class="nav-item" v-if="userInfo.loggedIn == false">
							<router-link class="nav-link" to="/login"><i class="bi bi-person-fill sp-icon"></i> {{ userInfo.userName }}</router-link>
						</li>
						<div class="dropdown" v-if="userInfo.loggedIn == true" @click="notificationSeen()">
							<button class="btn btn-secondary dropdown-toggle position-relative" type="button" id="notificationsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
								<i class="bi bi-bell sp-icon"></i>
								<span class="notification-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
							</button>
							<ul class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="notificationsDropdown">
								<li v-for="notification in notifications" :key="notification.id" class="notification-card">
									<div class="card mb-3">
										<div class="card-body">
											<h5 class="card-title">{{ notification.title }}</h5>
											<p class="card-text">{{ notification.message }}</p>
											<p class="card-text">
												<small class="text-muted">{{ formatDate(notification.createdAt) }}</small>
											</p>
										</div>
									</div>
								</li>
								<li v-if="notifications.length === 0" class="notification-card">
									<div class="card">
										<div class="card-body">
											<p class="card-text">No new notifications</p>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</ul>
				</div>
			</div>
		</nav>
	</header>
</template>

<script setup>
	import { ref, onMounted, computed, onUnmounted, watch } from "vue";
	import { userStore } from "../stores/userStore";
	import { useRouter, useRoute } from "vue-router";
	import axios from "axios";

	const userInfo = userStore();
	const route = useRoute();
	const router = useRouter();
	const notifications = ref([]);
	const notificationsNumber = ref(notifications.value.length);
	const notificationCount = computed(() => notificationsNumber.value);
	let intervalId;

	onMounted(async () => {
		await loadNotifications();
		startNotificationPoller();
	});

	onUnmounted(() => {
		stopNotificationPoller();
	});

	watch(
		() => userInfo.loggedIn,
		async (newValue) => {
			if (newValue) {
				await loadNotifications();
			}
		}
	);

	async function loadNotifications() {
		try {
			if (userInfo.loggedIn) {
				const response = await userInfo.loadNotifications();
				if (response.success && Array.isArray(response.notifications)) {
					notifications.value = response.notifications;
					const unseenNotifications = notifications.value.filter((notification) => !notification.seen);
					notificationsNumber.value = unseenNotifications.length;
				} else {
					notifications.value = [];
					notificationsNumber.value = 0;
				}
			}
		} catch (error) {
			console.error("Error loading notifications:", error);
			notifications.value = [];
			notificationsNumber.value = 0;
		}
	}
	function startNotificationPoller() {
		intervalId = setInterval(loadNotifications, 30000);
	}

	function stopNotificationPoller() {
		clearInterval(intervalId);
	}

	async function logout() {
		stopNotificationPoller();
		notifications.value = [];
		userInfo.logOutUser();
		router.push("/");
	}

	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleString();
	}
	async function notificationSeen() {
		notificationsNumber.value = 0;
		axios
			.post(
				"/notificationSeen",
				{ userId: userInfo.userId },
				{
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}
</script>
<style scoped>
	header {
		width: 100%;
		position: fixed;
		z-index: 999;
		top: 0%;
		box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.329);
	}
	.sp-icon {
		font-size: 20px;
	}
	.nav-item {
		color: #000000;
		border-radius: 8%;
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}
	.notification-dropdown {
		max-height: 400px;
		width: 200px;
		overflow-y: auto;
		margin-right: 0.5rem;
		margin-left: 0.5;
	}
	.notification-card {
		padding: 0.5rem;
	}
	.notification-badge {
		position: absolute;
		top: -5px;
		right: -5px;
		background-color: red;
		color: white;
		font-size: 12px;
		font-weight: bold;
		padding: 2px 6px;
		border-radius: 50%;
	}
</style>
