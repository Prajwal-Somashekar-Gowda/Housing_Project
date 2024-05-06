<template>
	<div class="Rooms">
		<h1 class="text-center">Rooms for rent</h1>
		<br /><br /><br />

		<div class="row">
			<div v-for="category in displayedCategories" :key="category.id" class="col-lg-4 col-md-6 col-sm-6 col-6 d-flex justify-content-center py-3">
				<div class="card text-light sp-card">
					<div class="position-relative">
						<img :src="userInfo.ImageURL + category.images[0]" class="card-img-top" alt="Room Image" />
						<div class="badges">
							<span class="badge bg-secondary">{{ category.location }}</span>
							<span class="badge bg-primary">{{ category.price }}</span>
						</div>
					</div>
					<div class="card-body d-flex flex-column justify-content-between align-items-start sp-bg-image-card">
						<div>
							<h3 class="card-title text-black-50 fs-5">{{ category.name }}</h3>
							<p class="card-text text-muted fs-6">{{ category.smallDescription }}</p>
						</div>
						<div class="text-center">
							<p class="card-text text-muted fs-6">{{ category.fullDescription }}</p>
							<button class="btn btn-primary btn-sm mt-2" @click="router.push('./rooms')">More</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="d-flex justify-content-center mt-5">
			<a class="btn btn-primary me-3" @click="previousPage" v-if="currentPage > 1">
				<i class="bi bi-arrow-left"></i>
			</a>
			<a class="btn btn-primary" @click="nextPage" v-if="currentPage < totalPages">
				<i class="bi bi-arrow-right"></i>
			</a>
		</div>
	</div>
</template>
<style>
	/* --------------------------------------------- Categories Card --------------------------------------------- */
	.Rooms {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	.badges {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-between;
		padding: 10px;
	}
	.sp-categories-card {
		width: 100%;
		height: 100%;
		background-color: #f9f7f7;
		position: relative;
	}

	.sp-card {
		width: 350px;
		height: 100%;
		transition: 0.7s;
		box-shadow: 0 5px 25px rgba(112, 112, 112, 0.199);
		cursor: pointer;
		color: black;
	}

	.sp-card:hover {
		transform: scale(1.1);
	}

	.sp-bg-image-card {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.sp-card-text {
		color: black;
		font-size: 1.1rem;
	}

	.sp-badge {
		border: 1px solid black;
	}

	.sp-badge:not(:last-child) {
		margin-right: 0.5rem;
	}
</style>
<script setup>
	import axios from "axios";
	import { ref, computed, onMounted } from "vue";
	import { useRouter, useRoute } from "vue-router";
	import { userStore } from "../stores/userStore";
	const userInfo = userStore();
	const route = useRoute();
	const router = useRouter();
	const categories = ref([]); // Initialize categories as an empty array

	const itemsPerPage = 6; // Number of items to display per page
	const currentPage = ref(1); // Current page number

	const totalPages = computed(() => Math.ceil(categories.value.length / itemsPerPage));

	const displayedCategories = computed(() => {
		const startIndex = (currentPage.value - 1) * itemsPerPage;
		const endIndex = currentPage.value * itemsPerPage;
		return categories.value.slice(startIndex, endIndex);
	});

	const previousPage = () => {
		currentPage.value--;
	};

	const nextPage = () => {
		currentPage.value++;
	};

	const getAllPosts = async () => {
		try {
			const response = await axios.get("/landingPagePosts");
			categories.value = response.data.slice(0, 12); // Update categories with the first 12 results
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	};

	// Call getAllPosts when the component is mounted
	onMounted(getAllPosts);
</script>
