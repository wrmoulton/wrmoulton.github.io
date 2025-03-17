document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chatbot-button");
  const chatWindow = document.getElementById("chatbot-window");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");

  // Toggle chat window
  chatBtn.addEventListener("click", () => {
    if (chatWindow.style.display === "none") {
      chatWindow.style.display = "block";
      chatInput.focus();
    } else {
      chatWindow.style.display = "none";
    }
  });

  // Handle message input
  chatInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && chatInput.value.trim() !== "") {
      const userMsg = chatInput.value.trim();
      appendMessage("You", userMsg);
      chatInput.value = "";

      appendMessage("WillBot", "Typing...");

      try {
        const response = await fetch("https://willbot-backend.vercel.app/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMsg }),
        });
        const data = await response.json();

        // Remove Typing...
        const typing = chatMessages.lastChild;
        if (typing.innerText.includes("Typing")) {
          chatMessages.removeChild(typing);
        }

        appendMessage("WillBot", data.reply);
      } catch (err) {
        appendMessage("WillBot", "Oops! Something went wrong.");
      }
    }
  });

  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.style.marginBottom = "8px";
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
