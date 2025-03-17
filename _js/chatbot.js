document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chatbot-button");
  const chatWindow = document.getElementById("chatbot-window");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");

  chatBtn.addEventListener("click", () => {
    chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
  });

  chatInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const userMsg = chatInput.value.trim();
      appendMessage("You", userMsg);
      chatInput.value = "";
      
      // Send to backend API
      const response = await fetch("https://YOUR_BACKEND_URL/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      appendMessage("WillBot", data.reply);
    }
  });

  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
