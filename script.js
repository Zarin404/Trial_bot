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

  fetch("https://huggingface.co/spaces/ZarOUT/bot_backendHF/api/predict/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [text] }) // Correct format for Gradio Spaces
  })
    .then(res => res.json())
    .then(data => {
      let reply = "Sorry, no reply.";
      if (data?.data?.length) {
        reply = data.data[0]; // Correctly read the response
      }
      appendMessage(reply, "bot");
    })
    .catch(err => {
      appendMessage("Error connecting to bot.", "bot");
      console.error(err);
    });
}

// Send on button click
sendBtn.onclick = sendMessage;

// Send on Enter key press
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
