<template>
	<div class="container d-flex justify-content-center align-items-center h-100">
		<div class="card w-100" v-if="profiles.length > 0">
			<img class="card-img-top" :src="profileImgURL" alt="Profile Image" />
			<div class="card-body">
				<div class="d-flex justify-content-between align-items-center">
					<h5 class="card-title mb-0">{{ currentProfile.username }}</h5>
					<div class="badge bg-success">{{ currentProfile.matchPercentage.toFixed(1) }}% Match</div>
				</div>

				<p class="card-text">{{ currentProfile.aboutMe }}</p>

				<div class="profile-details">
					<p><strong>Gender:</strong> {{ currentProfile.gender }}</p>
					<p><strong>Age:</strong> {{ currentProfile.age }}</p>
				</div>
			</div>
			<div class="card-footer d-flex justify-content-end">
				<button class="btn btn-danger mr-2" @click="rejectProfile">Reject</button>
				<button class="btn btn-success ml-2" @click="acceptProfile">Accept</button>
				<button class="btn btn-primary" @click="showPreferencesBool">View Preferences</button>
			</div>
		</div>
		<div class="card w-100" v-if="profiles.length == 0">
			<div class="card-body">
				<div class="d-flex justify-content-between align-items-center">
					<h5 class="card-title mb-0">No More Users to Match</h5>
				</div>
			</div>
			<div class="card-footer d-flex justify-content-end"></div>
		</div>
		<div v-if="showRejectModal" class="modal-overlay">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Confirm Rejection</h5>
					<button type="button" class="close" @click="showRejectModal = false">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body">Are you sure you want to reject this profile?</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" @click="showRejectModal = false">Cancel</button>
					<button type="button" class="btn btn-danger" @click="confirmReject">Reject</button>
				</div>
			</div>
		</div>
		<div class="modal" v-if="showPreferences">
			<div class="modal-dialog modal-dialog-scrollable modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="preferencesModalLabel">Preferences</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="showPreferencesBool"></button>
					</div>
					<div class="modal-body">
						<div class="container-fluid">
							<div class="row">
								<div class="col-md-6">
									<div class="mb-3">
										<label for="genderPreference" class="form-label">Gender Preference</label>
										<input type="text" class="form-control" id="genderPreference" v-model="preferences.genderPreference" readonly />
									</div>
									<div class="mb-3">
										<label for="bedtime" class="form-label">Bedtime</label>
										<input type="text" class="form-control" id="bedtime" v-model="preferences.bedtime" readonly />
									</div>
									<div class="mb-3">
										<label for="tidiness" class="form-label">Tidiness</label>
										<input type="text" class="form-control" id="tidiness" v-model="preferences.tidiness" readonly />
									</div>
									<div class="mb-3">
										<label for="smoking" class="form-label">Smoking</label>
										<input type="text" class="form-control" id="smoking" v-model="preferences.smoking" readonly />
									</div>
									<div class="mb-3">
										<label for="willingToLiveWithSmoker" class="form-label">Willing to Live with Smoker</label>
										<input type="text" class="form-control" id="willingToLiveWithSmoker" v-model="preferences.willingToLiveWithSmoker" readonly />
									</div>
								</div>
								<div class="col-md-6">
									<div class="mb-3">
										<label for="freeTime" class="form-label">Free Time</label>
										<input type="text" class="form-control" id="freeTime" v-model="preferences.freeTime" readonly />
									</div>
									<div class="mb-3">
										<label for="friendsVisit" class="form-label">Friends Visit</label>
										<input type="text" class="form-control" id="friendsVisit" v-model="preferences.friendsVisit" readonly />
									</div>
									<div class="mb-3">
										<label for="petsComfortable" class="form-label">Pets Comfortable</label>
										<input type="text" class="form-control" id="petsComfortable" v-model="preferences.petsComfortable" readonly />
									</div>
									<div class="mb-3">
										<label for="petPreferences" class="form-label">Pet Preferences</label>
										<textarea class="form-control" id="petPreferences" rows="3" v-model="preferences.petPreferences" readonly></textarea>
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-6">
									<div class="mb-3">
										<label for="noiseLevel" class="form-label">Noise Level</label>
										<input type="text" class="form-control" id="noiseLevel" v-model="preferences.noiseLevel" readonly />
									</div>
									<div class="mb-3">
										<label for="cookingFrequency" class="form-label">Cooking Frequency</label>
										<input type="text" class="form-control" id="cookingFrequency" v-model="preferences.cookingFrequency" readonly />
									</div>
									<div class="mb-3">
										<label for="sharingBelongings" class="form-label">Sharing Belongings</label>
										<input type="text" class="form-control" id="sharingBelongings" v-model="preferences.sharingBelongings" readonly />
									</div>
								</div>
								<div class="col-md-6">
									<div class="mb-3">
										<label for="overnightGuests" class="form-label">Overnight Guests</label>
										<input type="text" class="form-control" id="overnightGuests" v-model="preferences.overnightGuests" readonly />
									</div>
									<div class="mb-3">
										<label for="cleaningDuties" class="form-label">Cleaning Duties</label>
										<input type="text" class="form-control" id="cleaningDuties" v-model="preferences.cleaningDuties" readonly />
									</div>
									<div class="mb-3">
										<label for="workSchedule" class="form-label">Work Schedule</label>
										<input type="text" class="form-control" id="workSchedule" v-model="preferences.workSchedule" readonly />
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-md-6">
									<div class="mb-3">
										<label for="spaceUsage" class="form-label">Space Usage</label>
										<input type="text" class="form-control" id="spaceUsage" v-model="preferences.spaceUsage" readonly />
									</div>
									<div class="mb-3">
										<label for="hobbies" class="form-label">Hobbies</label>
										<textarea class="form-control" id="hobbies" rows="3" v-model="preferences.hobbies" readonly></textarea>
									</div>
									<div class="mb-3">
										<label for="privacyExpectation" class="form-label">Privacy Expectation</label>
										<input type="text" class="form-control" id="privacyExpectation" v-model="preferences.privacyExpectation" readonly />
									</div>
								</div>
								<div class="col-md-6">
									<div class="mb-3">
										<label for="allergies" class="form-label">Allergies</label>
										<textarea class="form-control" id="allergies" rows="3" v-model="preferences.allergies" readonly></textarea>
									</div>
									<div class="mb-3">
										<label for="longTermPlans" class="form-label">Long-Term Plans</label>
										<input type="text" class="form-control" id="longTermPlans" v-model="preferences.longTermPlans" readonly />
									</div>
									<div class="mb-3">
										<label for="billSplit" class="form-label">Bill Split</label>
										<input type="text" class="form-control" id="billSplit" v-model="preferences.billSplit" readonly />
									</div>
									<div class="mb-3">
										<label for="conflictResolution" class="form-label">Conflict Resolution</label>
										<input type="text" class="form-control" id="conflictResolution" v-model="preferences.conflictResolution" readonly />
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="showPreferencesBool">Close</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import axios from "axios";
	import { userStore } from "../stores/userStore";
	const userInfo = userStore();
	const profileImgURL = ref("");
	const profiles = ref([]);
	const showRejectModal = ref(false);
	const currentProfile = ref(profiles.value[0]);
	const showPreferences = ref(false);
	const preferences = ref({
		genderPreference: "",
		bedtime: "",
		tidiness: "",
		smoking: "",
		willingToLiveWithSmoker: "",
		freeTime: "",
		friendsVisit: "",
		petsComfortable: "",
		petPreferences: "",
		noiseLevel: "",
		cookingFrequency: "",
		sharingBelongings: "",
		overnightGuests: "",
		cleaningDuties: "",
		workSchedule: "",
		spaceUsage: "",
		hobbies: "",
		privacyExpectation: "",
		allergies: "",
		longTermPlans: "",
		billSplit: "",
		conflictResolution: "",
	});
	onMounted(async () => {
		loadMatchingUsers();
	});
	const rejectProfile = async () => {
		showRejectModal.value = true;
	};

	const confirmReject = async () => {
		await createMatchAndChat(userInfo.userId, profiles.value[0].id, profiles.value[0].username, profiles.value[0].matchPercentage, false);
		profiles.value.shift();
		updateCurrentProfile();
		showRejectModal.value = false;
	};

	const acceptProfile = async () => {
		await createMatchAndChat(userInfo.userId, profiles.value[0].id, profiles.value[0].username, profiles.value[0].matchPercentage, true);
		profiles.value.shift();
		updateCurrentProfile();
	};

	const updateCurrentProfile = () => {
		if (profiles.value.length > 0) {
			currentProfile.value = profiles.value[0];
			profileImgURL.value = userInfo.ImageURL + `uploads/profilePictures/` + currentProfile.value.profilePicture;
		} else {
		}
	};

	async function loadMatchingUsers() {
		await axios
			.get("/user/matchingUsers", { withCredentials: true })
			.then((response) => {
				profiles.value = response.data.matching;
				currentProfile.value = profiles.value[0];
				console.log(response);
				profileImgURL.value = userInfo.ImageURL + `uploads/profilePictures/` + currentProfile.value.profilePicture;
			})
			.catch(function (error) {});
	}
	async function createMatchAndChat(requesterId, requesteeId, requestedToUsername, requesteeMatchPercentage, matchBoolen) {
		try {
			const response = await axios.post("/user/matchWithUser", {
				requesterId,
				requesteeId,
				requestedToUsername,
				requesteeMatchPercentage,
				matchBoolen,
			});

			//  console.log("Matched and chat created:", response.data);
		} catch (error) {
			console.error("Error creating matched and chat:", error);
		}
	}
	async function showPreferencesBool() {
		await loadPreferences(currentProfile.value.id);
		let showPreferencesboolen = showPreferences.value;
		showPreferences.value = !showPreferencesboolen;
	}
	async function loadPreferences(userId) {
		try {
			await axios
				.get(`/user/getPreferences/${userId}`)
				.then((response) => {
					console.log(response.data);
					if (response.data.success && response.data.preferences) {
						Object.assign(preferences.value, response.data.preferences);
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		} catch (error) {
			console.error("Error loading preferences:", error);
		}
	}
</script>

<style scoped>
	.container {
		margin-top: 7rem;
		margin-bottom: 2rem;
		display: flex;
		flex-direction: column;
		height: 80vh;
		width: 30vw;
		overflow-x: hidden;
		background-color: rgba(243, 241, 241, 0.233);
		border-top-left-radius: 2%;
		border-bottom-left-radius: 2%;
	}

	.card {
		max-width: 40rem;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}

	.modal-content {
		background-color: #fefefe;
		margin: 15% auto;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.modal-title {
		margin: 0;
	}

	.modal-body {
		margin-bottom: 20px;
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
	}

	.modal {
		display: block;
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgba(0, 0, 0, 0.4);
	}

	textarea[readonly="readonly"],
	textarea[readonly] {
		background-color: rgb(245, 245, 245);
	}

	input[readonly="readonly"],
	input[readonly] {
		background-color: rgb(245, 245, 245);
	}
</style>
