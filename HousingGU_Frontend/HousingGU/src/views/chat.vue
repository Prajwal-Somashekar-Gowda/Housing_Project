<template>
	<div class="container">
		<div class="header">
			<img :src="userInfo.ImageURL + 'uploads/profilePictures/' + chatImage" alt="Avatar" class="avatar" />
			<h2>{{ chatRoomName }}</h2>
		</div>
		<div class="chat-container">
			<div class="chat-messages">
				<div v-for="message in messages" :key="message.id" class="message-container">
					<div :class="['message', message.senderId === userInfo.userId ? 'from-me' : 'from-others']">
						<div class="message-content">{{ message.content }}</div>
					</div>
				</div>
			</div>
			<div class="input-group chat-input-container">
				<input type="text" class="form-control chat-input" v-model="newMessage" placeholder="Type your message" @keyup.enter="sendMessageIfNotEmpty" />
				<button @click="sendMessageIfNotEmpty" class="btn btn-primary send-button">Send</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 90vh;
		background-color: rgba(213, 169, 248, 0.233);
		margin-top: 6rem;
		margin-bottom: 2rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.header {
		display: flex;
		align-items: center;
		padding: 0.5rem;
		background-color: #f8f9fa;
		margin-top: 1rem;
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		object-fit: cover;
		margin-right: 1rem;
	}

	.chat-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
	}

	.message-container {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 1rem;
	}

	.message {
		padding: 0.8rem;
		border-radius: 0.8rem;
		word-wrap: break-word;
		max-width: 70%;
	}

	.message-content {
		word-wrap: break-word;
	}

	.from-me {
		margin-left: auto; /* Push messages from the current user to the right */
		background-color: #dcf8c6;
		color: #000;
	}

	.from-others {
		margin-right: auto; /* Push messages from others to the left */
		background-color: #f8f9fa;
		color: #000;
	}

	.chat-input-container {
		display: flex;
		align-items: center;
		margin-top: 1rem;
	}

	.chat-input {
		flex: 1;
		padding: 0.8rem;
		border-radius: 0.4rem;
		border: 1px solid #ddd;
	}

	.send-button {
		padding: 0.8rem;
		border-radius: 20%;
		text-align: center;
		cursor: pointer;
	}

	.chat-container {
		background-color: white;
		border-radius: 5px;
		overflow: hidden;
	}
</style>

<script setup>
	import { ref, reactive, onMounted } from "vue";
	import axios from "axios";
	import { useRoute } from "vue-router";
	import { useRouter } from "vue-router";
	import io from "socket.io-client";
	import { userStore } from "../stores/userStore";
	import { toast } from "vue3-toastify";
	const router = useRouter();
	const userInfo = userStore();
	const route = useRoute();
	const chatId = route.params.chatId;
	const userId = userInfo.userId;
	const chatRoomName = ref("");
	//const socket = io("http://localhost:3000"); // for local dev
	const socket = io("http://89.116.167.130:3000");
	const messages = ref([]);
	const newMessage = ref("");
	const chatImage = ref("");
	onMounted(() => {
		if (chatId) {
			joinChat(chatId);
		} else {
			console.error("Invalid chat ID.");
		}
	});

	// Join a chat room
	async function joinChat(chatId) {
		try {
			socket.emit("join-chat", chatId);
			socket.on("chat-messages", ({ chatMessages, RequestedToName, RequestedByName, userImages }) => {
				if (chatMessages == "empty") {
					toast.error("Chat ID is Wrong Redircting to Homepage", {
						position: toast.POSITION.BOTTOM_RIGHT,
						theme: "colored",
					});
					setTimeout(() => {
						router.push("/");
					}, 2000);
				} else {
					if (RequestedByName == userInfo.userName) {
						chatRoomName.value = RequestedToName;
					} else {
						chatRoomName.value = RequestedByName;
					}
					if (userImages[0].profilePicture == userInfo.profilePicture) {
						chatImage.value = userImages[1].profilePicture;
					} else {
						chatImage.value = userImages[0].profilePicture;
					}
					messages.value = chatMessages;
				}
			});
			socket.on("new-message", (message) => {
				messages.value.push(message);
			});
		} catch (error) {
			console.error("Error joining chat:", error);
		}
	}

	// Send a message
	function sendMessageIfNotEmpty() {
		if (newMessage.value.trim() !== "") {
			const messageData = {
				content: newMessage.value,
				senderId: userId,
				chatId,
			};
			socket.emit("send-message", messageData);
			newMessage.value = "";
		}
	}
</script>
