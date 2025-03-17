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

      // Add recommendations ONLY if chat is empty
      if (chatMessages.innerHTML.trim() === "") {
        appendRecommendation();
      }
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

  // Append user and bot messages
  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.style.marginBottom = "8px";
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Append recommendation buttons
  function appendRecommendation() {
    const recDiv = document.createElement("div");
    recDiv.style.marginBottom = "10px";
    recDiv.style.opacity = "0.9";

    recDiv.innerHTML = `<strong>Quick Suggestions:</strong><br>`;

    const suggestions = ["/joke", "More on Projects", "More on Experience"];

    suggestions.forEach((text) => {
      const btn = document.createElement("button");
      btn.innerText = text;
      btn.style.margin = "5px 5px 0 0";
      btn.style.padding = "5px 10px";
      btn.style.border = "none";
      btn.style.borderRadius = "5px";
      btn.style.backgroundColor = "#e63946";
      btn.style.color = "white";
      btn.style.cursor = "pointer";
      btn.style.fontSize = "0.9em";

      btn.addEventListener("click", () => {
        chatInput.value = text;
        chatInput.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
      });

      recDiv.appendChild(btn);
    });

    chatMessages.appendChild(recDiv);
  }
});
