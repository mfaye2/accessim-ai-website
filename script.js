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

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://accessim-ai-server.onrender.com";


async function envoyer() {

  const input = document.getElementById("message");
  const sendButton = document.getElementById("sendChatBtn");

  const msg = input.value.trim();

  if (msg === "") return;

  ajouterMessage("client", msg);
  input.value = "";

  sendButton.disabled = true;
  sendButton.textContent = "Patientez...";

  ajouterMessage("agent", "Assistant réfléchit...");

  try {

    const res = await fetch(`${API_URL}/chat`, {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: msg
      })

    });

    const data = await res.json();

    const messagesAgent = document.querySelectorAll(".message-agent");
    const dernierMessageAgent = messagesAgent[messagesAgent.length - 1];

    if (data.reply) {
      let texteReponse = data.reply;

texteReponse = texteReponse.replace(
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
  '<a href="$2" target="_blank">$1</a>'
);

dernierMessageAgent.innerHTML = texteReponse.replace(/\n/g, "<br>");
    } else {
      dernierMessageAgent.textContent = "Je n’ai pas reçu de réponse.";
    }

  } catch (error) {

    const messagesAgent = document.querySelectorAll(".message-agent");
    const dernierMessageAgent = messagesAgent[messagesAgent.length - 1];

    dernierMessageAgent.textContent = "Erreur : le serveur ne répond pas.";

  } finally {

    sendButton.disabled = false;
    sendButton.textContent = "Envoyer";

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

  let texteAffiche = texte;

texteAffiche = texteAffiche.replace(
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
  '<a href="$2" target="_blank">$1</a>'
);

div.innerHTML = texteAffiche.replace(/\n/g, "<br>");

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
const formMessage = document.getElementById("formMessage");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitButton = contactForm.querySelector("button");

submitButton.disabled = true;
submitButton.textContent = "Envoi en cours...";

formMessage.textContent = "";

const formData = new FormData(contactForm);

const name = formData.get("name").trim();
const email = formData.get("email").trim();
const message = formData.get("message").trim();

if (name.length < 1) {
  formMessage.textContent = "Veuillez entrer un nom valide.";
  formMessage.style.color = "red";
  return;
}

if (!email.includes("@")) {
  formMessage.textContent = "Veuillez entrer un email valide.";
  formMessage.style.color = "red";
  return;
}

if (message.length < 10) {
  formMessage.textContent = "Votre demande doit contenir au moins 10 caractères.";
  formMessage.style.color = "red";
  return;
}

    try {

const N8N_WEBHOOK_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5678/webhook-test/contact"
    : "https://accessim-ai-n8n.onrender.com/webhook/contact";

const response = await fetch(N8N_WEBHOOK_URL, {

    method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: name,
    email: email,
    message: message
  })
});

      if (response.ok) {
        formMessage.textContent = "Message envoyé avec succès ✅";
        formMessage.style.color = "#00ff88";
        contactForm.reset();
      } else {
        formMessage.textContent = "Erreur d’envoi ❌";
        formMessage.style.color = "red";
      }
    } catch (error) {
      formMessage.textContent = "Erreur serveur ❌";
      formMessage.style.color = "red";
      console.error(error);
    }
    finally {
  submitButton.disabled = false;
  submitButton.textContent = "Envoyer";
}


  });
}