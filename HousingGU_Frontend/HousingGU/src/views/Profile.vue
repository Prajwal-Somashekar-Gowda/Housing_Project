<template>
	<div class="container">
		<div class="row">
			<div class="col-md-4">
				<div class="card">
					<img :src="profileImgURL" alt="Profile Picture" class="card-img-top" />
					<div class="card-body">
						<h5 class="card-title">John Doe</h5>
						<p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at leo id lorem commodo consequat.</p>
						<button class="btn btn-primary" @click="editProfile">Edit Profile</button>
					</div>
				</div>
			</div>
			<div class="col-md-8">
				<div class="card">
					<div class="card-body">
						<h5 class="card-title">About</h5>
						<p class="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at leo id lorem commodo consequat. Suspendisse potenti. Aliquam erat volutpat.</p>
					</div>
				</div>
				<div class="card">
					<div class="card-body">
						<h5 class="card-title">Photos</h5>
						<div class="row">
							<div class="col-md-4">
								<img src="../assets/img/apartment.jpg" alt="Photo 1" class="img-fluid" />
							</div>
							<div class="col-md-4">
								<img src="../assets/img/apartment.jpg" alt="Photo 2" class="img-fluid" />
							</div>
							<div class="col-md-4">
								<img src="../assets/img/apartment.jpg" alt="Photo 3" class="img-fluid" />
							</div>
						</div>
					</div>
				</div>
				<div class="card">
					<div class="card-body">
						<h5 class="card-title">Friends</h5>
						<div class="list-group">
							<button v-for="friend in friends" :key="friend.id" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" @click="goToChat(friend.id)">
								{{ friend.name }}
								<button class="btn btn-primary">Chat</button>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import { userStore } from "../stores/userStore";
	import { useRouter } from "vue-router";
	const userInfo = userStore();
	const router = useRouter();
	const profileImgURL = ref("");
	const friends = [
		{ id: 1, name: "Friend 1" },
		{ id: 2, name: "Friend 2" },
		{ id: 3, name: "Friend 3" },
		{ id: 4, name: "Friend 4" },
		{ id: 5, name: "Friend 5" },
	];
	onMounted(() => {
		console.log(userInfo.profilePicture);
		profileImgURL.value = `http://localhost:5555/uploads/` + userInfo.profilePicture;
	});
	const goToChat = (friendId) => {
		router.push(`/chat/${friendId}`);
	};
</script>

<style scoped>
	.container {
		margin-top: 5rem;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		height: 95vh;
		overflow-x: hidden;
		background-color: rgba(243, 241, 241, 0.233);
		border-top-left-radius: 2%;
		border-bottom-left-radius: 2%;
	}
</style>
