document.addEventListener("DOMContentLoaded", () => {
  const chatBtn = document.getElementById("chatbot-button");
  const chatWindow = document.getElementById("chatbot-window");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");

  const terminalModal = document.getElementById("terminal-modal");
  const terminalContent = document.getElementById("terminal-content");
  const terminalInput = document.getElementById("terminal-input");
  const terminalClose = document.getElementById("terminal-close");

  // === Chatbot Toggle ===
  chatBtn.addEventListener("click", () => {
    if (chatWindow.style.display === "none") {
      chatWindow.style.display = "block";
      chatInput.focus();

      if (chatMessages.innerHTML.trim() === "") {
        appendRecommendation();
      }
    } else {
      chatWindow.style.display = "none";
    }
  });

  // === Chatbot Input Handling ===
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

  // === Append Messages ===
  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.style.marginBottom = "8px";
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // === Recommendation Buttons ===
  function appendRecommendation() {
    const recDiv = document.createElement("div");
    recDiv.style.marginBottom = "10px";
    recDiv.style.opacity = "0.9";

    recDiv.innerHTML = `<strong>Quick Suggestions:</strong><br>`;

    const suggestions = ["/joke", "More on Projects", "More on Experience", "Let's Play a Game"];

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
        if (text === "Let's Play a Game") {
          // Hide Chatbot, Show Terminal
          chatWindow.style.display = "none";
          terminalModal.style.display = "block";
          terminalInput.focus();
        } else {
          chatInput.value = text;
          chatInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        }
      });

      recDiv.appendChild(btn);
    });

    chatMessages.appendChild(recDiv);
  }

  // === Terminal Game Logic ===
  let hackerStage = 0;

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && terminalInput.value.trim() !== "") {
      const input = terminalInput.value.trim();
      terminalContent.innerHTML += `<br>> ${input}`;
      terminalInput.value = "";

      processHackerInput(input);
      terminalContent.scrollTop = terminalContent.scrollHeight;
    }
  });

  terminalClose.addEventListener("click", () => {
    terminalModal.style.display = "none";
    chatWindow.style.display = "block";
  });

  function processHackerInput(input) {
    if (hackerStage === 0) {
      if (input.toLowerCase() === "start") {
        terminalContent.innerHTML += `<br><br>Puzzle 1: Decode this Base64 → <code>U2F2ZVRoZURhdGE=</code><br>Type your answer:`;
        hackerStage++;
      } else {
        terminalContent.innerHTML += `<br>Type <code>start</code> to begin the challenge.`;
      }
    } else if (hackerStage === 1) {
      if (input.toLowerCase() === "savethedata") {
        terminalContent.innerHTML += `<br>✔️ Correct!<br><br>Puzzle 2: What is 23 + 47?<br>Type your answer:`;
        hackerStage++;
      } else {
        terminalContent.innerHTML += `<br>❌ Incorrect. Try again.`;
      }
    } else if (hackerStage === 2) {
      if (input === "70") {
        terminalContent.innerHTML += `<br>✔️ Correct!<br><br>Puzzle 3: Regex Challenge → Match "hack" in:<br><code>hacker, stack, lack</code><br>Type regex pattern:`;
        hackerStage++;
      } else {
        terminalContent.innerHTML += `<br>❌ Incorrect. Try again.`;
      }
    } else if (hackerStage === 3) {
      if (input === "hack") {
        terminalContent.innerHTML += `<br>🎉 Folder Unlocked! You're a pro!<br><br>Type <code>restart</code> to play again, or [X] to exit.`;
        hackerStage++;
      } else {
        terminalContent.innerHTML += `<br>❌ Incorrect. Hint: it’s 'hack'!`;
      }
    } else {
      if (input.toLowerCase() === "restart") {
        terminalContent.innerHTML += `<br><br>🔁 Restarting challenge...<br>Type <code>start</code> to begin.`;
        hackerStage = 0;
      } else {
        terminalContent.innerHTML += `<br>Type <code>restart</code> or click [X] to exit.`;
      }
    }
  }

});
