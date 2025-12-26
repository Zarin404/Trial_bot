const chatbox = document.getElementById("chatbox");
const toggle = document.getElementById("chat-toggle");
const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Toggle chatbox visibility using class
toggle.onclick = () => {
  chatbox.classList.toggle("active");
};

// Append message and auto-scroll
function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Send user message to backend
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  fetch("RENDER_BACKEND_URL/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
  .then(res => res.json())
  .then(data => {
    appendMessage(data.reply, "bot");
  })
  .catch(err => {
    appendMessage("Error connecting to bot.", "bot");
    console.error(err);
  });
}

// Send on button click
sendBtn.onclick = sendMessage;

// Optional: send on Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
