const reveals = document.querySelectorAll(".reveal");

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.12 });

reveals.forEach((reveal) => {
  io.observe(reveal);
});

const steps = Array.from(document.querySelectorAll(".process-step"));
const panels = Array.from(document.querySelectorAll(".process-panel"));
const percentBadge = document.getElementById("percentBadge");

const percents = ["70%", "85%", "92%", "100%"];
let activeStep = 0;
let timer = null;

function setActiveStep(index) {
  activeStep = index;

  steps.forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === index);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", Number(panel.dataset.panel) === index);
  });

  percentBadge.textContent = percents[index];
}

function startRotation() {
  clearInterval(timer);

  timer = setInterval(() => {
    const next = (activeStep + 1) % steps.length;
    setActiveStep(next);
  }, 3000);
}

steps.forEach((step) => {
  step.addEventListener("click", () => {
    setActiveStep(Number(step.dataset.step));
    startRotation();
  });
});

startRotation();

document.getElementById("year").textContent = new Date().getFullYear();
function toggleChat() {
  const chatbot = document.getElementById("chatbot");
  chatbot.classList.toggle("closed");
}







async function envoyer() {
  const input = document.getElementById("message");
  const msg = input.value.trim();

  if (msg === "") return;

  ajouterMessage("client", msg);
  input.value = "";

  try {
    const res = await fetch("https://accessim-ai-server.onrender.com/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    ajouterMessage("agent", data.reply);
  } catch (error) {
    ajouterMessage("agent", "Erreur : le serveur ne répond pas.");
  }
}

function ajouterMessage(type, texte) {
  const box = document.getElementById("chat-messages");

  const div = document.createElement("div");
  div.classList.add("message");

  if (type === "client") {
    div.classList.add("message-client");
  } else {
    div.classList.add("message-agent");
  }

  div.innerHTML = texte.replace(/\n/g, "<br>");

  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("message");

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        envoyer();
      }
    });
  }
});





const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(contactForm);

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      window.location.href = "/merci/index.html";
    })
    .catch((error) => {
      alert("Erreur lors de l’envoi. Réessayez.");
      console.error(error);
    });
  });
}