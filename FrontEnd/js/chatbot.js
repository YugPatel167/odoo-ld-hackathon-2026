/* ==========================================================================
   GlobeTrotter — Chatbot widget
   Ships as a rule-based FAQ bot so it works instantly with zero backend —
   good enough for a hackathon demo. To upgrade: point sendToBackend() at
   POST /api/chatbot (see server/routes-example.js) once someone wires up
   a real model call.
   ========================================================================== */

const CHATBOT_RULES = [
  { match: /budget|cost|expensive|price/i, reply: "Every trip has a Budget & Cost Breakdown screen — it totals transport, stay, activities and meals automatically as you build your itinerary, and flags days that go over budget." },
  { match: /add (a )?city|new city|stop/i, reply: "Open a trip, go to the Itinerary Builder, and hit “Add Stop” to search and add a city with its own dates." },
  { match: /activity|activities|things to do/i, reply: "Inside a stop you can browse activities by type, cost, and duration, then add them straight to that day's plan." },
  { match: /share|public|friend/i, reply: "Every trip has a Share button that creates a public read-only link — anyone with it can view, and even copy the trip as their own." },
  { match: /delete|remove|cancel trip/i, reply: "You can delete a trip from the My Trips list — use the trash icon on the trip card. This can't be undone, so it'll ask you to confirm first." },
  { match: /login|log in|sign up|account|password/i, reply: "Use the Login/Sign up page from the top nav. Forgot your password? There's a reset link on the login screen." },
  { match: /hi|hello|hey/i, reply: "Hey! I'm the GlobeTrotter assistant. Ask me about building trips, budgets, or sharing your itinerary." },
];

const CHATBOT_FALLBACK = "I'm a simple demo assistant right now, so I only know the basics — try asking about trips, budgets, activities, or sharing.";

function chatbotReply(text) {
  const rule = CHATBOT_RULES.find((r) => r.match.test(text));
  return rule ? rule.reply : CHATBOT_FALLBACK;
}

function initChatbot() {
  const launcher = document.getElementById("chatbot-launcher");
  const panel = document.getElementById("chatbot-panel");
  const closeBtn = document.getElementById("chatbot-close");
  const form = document.getElementById("chatbot-form");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");
  if (!launcher || !panel) return;

  const addMessage = (text, from) => {
    const div = document.createElement("div");
    div.className = `msg ${from}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  };

  launcher.addEventListener("click", () => panel.classList.toggle("open"));
  closeBtn.addEventListener("click", () => panel.classList.remove("open"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, "user");
    input.value = "";
    setTimeout(() => addMessage(chatbotReply(text), "bot"), 350);
  });
}

document.addEventListener("DOMContentLoaded", initChatbot);
