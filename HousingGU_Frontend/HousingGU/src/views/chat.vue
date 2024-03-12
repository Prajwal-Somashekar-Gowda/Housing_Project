<template>
	<div class="container">
		<div class="chat-container">
			<div class="chat-messages">
				<div v-for="message in messages" :key="message.id" class="message-container">
					<div class="message" :class="{ 'from-me': message.fromMe, 'from-others': !message.fromMe }">
						<div class="message-content">{{ message.content }}</div>
					</div>
				</div>
			</div>
			<div class="input-group chat-input-container">
				<input type="text" class="form-control chat-input" v-model="newMessage" placeholder="Type your message" />
				<button @click="sendMessage" class="btn btn-primary send-button">Send</button>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		height: 90vh;
		background-color: #f5f5f5;
		margin-top: 10rem;

		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.chat-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
	}

	.chat-messages {
		flex: 1;
		overflow-y: auto;
	}

	.message-container {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
	}

	.message {
		padding: 0.8rem;
		max-width: 70%;
		border-radius: 0.8rem;
		word-wrap: break-word;
	}
	.message-content {
		word-wrap: break-word;
	}

	.from-me {
		align-self: flex-end;
		background-color: #dcf8c6;
	}

	.from-others {
		align-self: flex-start;
		background-color: #f8f9fa;
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
		border: none;
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

	.chat-input {
		border: 1px solid #ddd;
	}
</style>

<script setup>
	import { ref, reactive, onMounted } from "vue";
	import { io } from "socket.io-client";
	const messages = reactive([]);
	const newMessage = ref("");

	const socket = io("http://localhost:3000");

	const sendMessage = () => {
		const message = newMessage.value.trim();
		if (message !== "") {
			socket.emit("chatMessage", message);
			newMessage.value = "";
		}
	};

	const receiveMessage = (message) => {
		messages.push({ id: Date.now(), content: message, fromMe: false });
	};

	socket.on("chatMessage", receiveMessage);
	onMounted(() => {});
</script>
