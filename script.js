const chatbox = document.getElementById("chatbox");
const toggle = document.getElementById("chat-toggle");
const messages = document.getElementById("messages");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Toggle chatbox visibility
toggle.onclick = () => {
  chatbox.classList.toggle("active");
};

// Append message to chat
function appendMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  messages.appendChild(msgDiv);
  messages.scrollTop = messages.scrollHeight;
}

// Send message to HF Space backend
function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  fetch("https://huggingface.co/spaces/ZarOUT/bot_backendHF/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      session_id: "web" // optional: can track sessions
    })
  })
    .then(res => res.json())
    .then(data => {
      let reply = "Sorry, no reply.";
      if (data?.reply) {
        reply = data.reply; // FastAPI returns { "reply": "..." }
      }
      appendMessage(reply, "bot");
    })
    .catch(err => {
      appendMessage("Error connecting to bot.", "bot");
      console.error(err);
    });
}

// Send message on button click
sendBtn.onclick = sendMessage;

// Send message on Enter key press
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
