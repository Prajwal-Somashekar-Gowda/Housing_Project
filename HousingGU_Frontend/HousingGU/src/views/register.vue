<template>
	<div class="register-page">
		<div class="register-container">
			<div class="register-form">
				<form :class="{ 'slide-in': formVisible }">
					<img src="../assets/img/logo.png" alt="Logo" class="LogoImg" />
					<h2>Create New Account</h2>
					<div class="mb-3">
						<label for="Username" class="form-label">Username</label>
						<input type="text" class="form-control" id="Username" placeholder="Enter your username" v-model="formUserName" />
					</div>
					<div class="mb-3">
						<label for="email" class="form-label">Email</label>
						<input type="email" class="form-control" id="email" placeholder="Enter your email" v-model="formEmail" />
					</div>
					<div class="mb-3">
						<label for="phoneNumber" class="form-label">Phone Number</label>
						<input type="tel" class="form-control" id="phoneNumber" placeholder="Enter your phone number" v-model="formPhone" />
					</div>
					<div class="mb-3">
						<label for="password" class="form-label">Password</label>
						<input type="password" class="form-control" id="password" placeholder="Enter your password" v-model="formPassword" />
					</div>
					<div class="mb-3">
						<label for="profilePicture" class="form-label">Profile Picture</label>
						<input type="file" id="profilePicture" @change="handleFileUpload" accept="image/*" />
					</div>
					<button type="button" @click="register()" class="btn btn-primary">Register</button>

					<div class="text-center mt-3">
						<button type="button" class="btn btn-secondary btn-sm" @click="router.push({ path: '/login' })">You already have an account?</button>
					</div>
				</form>
			</div>
			<div class="dashboard">
				<img src="../assets/img/login.jpg" alt="Dashboard Image" class="sideImg" />
			</div>
		</div>
	</div>
</template>

<script setup>
	import axios from "axios";
	import { ref, onMounted } from "vue";
	import { toast } from "vue3-toastify";
	import "vue3-toastify/dist/index.css";
	import { useRouter, useRoute } from "vue-router";

	const route = useRoute();
	const router = useRouter();
	const formUserName = ref("");
	const formPassword = ref("");
	const formEmail = ref("");
	const formPhone = ref("");
	const formVisible = ref(false);
	const profilePicture = ref(null); // Holds the uploaded profile picture file

	onMounted(() => {
		formVisible.value = true;
	});

	async function register() {
		// Perform form validation
		if (!formUserName.value || !formEmail.value || !formPhone.value || !formPassword.value) {
			toast.error("Please fill in all the required fields.", {
				position: toast.POSITION.BOTTOM_RIGHT,
				theme: "colored",
			});
			return;
		}

		// Check if the email is in a valid format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formEmail.value)) {
			toast.error("Please enter a valid email address.", {
				position: toast.POSITION.BOTTOM_RIGHT,
				theme: "colored",
			});
			return;
		}

		const registerCred = new FormData(); // Create a FormData object
		registerCred.append("username", formUserName.value);
		registerCred.append("email", formEmail.value);
		registerCred.append("password", formPassword.value);
		registerCred.append("phoneNumber", formPhone.value);
		registerCred.append("profilePicture", profilePicture.value); // Append the file to the FormData

		await axios
			.post("/signup", registerCred, {
				withCredentials: false,
				headers: {
					"Content-Type": "multipart/form-data", // Set the content type to multipart form data
				},
			})
			.then(function (response) {
				if (response.data.response == "ok") {
					toast.success("Account registered successfully", {
						position: toast.POSITION.BOTTOM_RIGHT,
						theme: "colored",
					});
					setTimeout(() => {
						router.push("/login");
					}, 2500);
				} else {
					if ((error.name = "AxiosError")) {
						toast.error(error.response.data, {
							position: toast.POSITION.BOTTOM_RIGHT,
							theme: "colored",
						});
					} else {
						toast.error(error.response.data.message, {
							position: toast.POSITION.BOTTOM_RIGHT,
							theme: "colored",
						});
					}
				}
			})
			.catch(function (error) {
				console.log(error.response.data);
				toast.error(error.response.data.errorMessage, {
					position: toast.POSITION.BOTTOM_RIGHT,
					theme: "colored",
				});
			});
	}

	function handleFileUpload(event) {
		const file = event.target.files[0];
		profilePicture.value = file;
	}
</script>

<style scoped>
	.LogoImg {
		width: 20vw;
	}
	.register-container {
		display: flex;
		height: 90vh;
		overflow-x: hidden;
	}
	.register-container .register-form {
		flex: 0 0 50%;
		background: #f8f9fa;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 50px;
	}

	.register-container .register-form form {
		max-width: 400px;
		width: 100%;
	}

	.register-container .register-form h2 {
		text-align: center;
		margin-bottom: 30px;
	}

	.register-container .dashboard {
		background: #f8f9fa;
		flex: 0 0 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #fff;
	}
	.register-container .dashboard img {
		width: 100%;
		height: 100%;
		clip-path: polygon(21% 0, 100% 0, 79% 100%, 0% 100%);
	}

	.register-container .dashboard a {
		color: #fff;
		text-decoration: underline;
	}

	.slide-in {
		animation: slideInFromLeft 0.6s ease-in-out forwards;
	}

	@keyframes slideInFromLeft {
		from {
			transform: translateX(-140%);
		}
		to {
			transform: translateX(0);
		}
	}
</style>
