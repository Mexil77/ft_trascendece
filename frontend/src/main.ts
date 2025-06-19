import { Navbar } from "./components/index.js";

document.addEventListener("DOMContentLoader", () => {});
const div = document.createElement("div");
const card = document.createElement("button");
card.className =
	"card w-64 h-80 bg-gray-800 text-white p-6 rounded-lg shadow-lg relative overflow-hidden transition-transform duration-300 hover:scale-105";
card.textContent = "click dinamico";
div.appendChild(card);
const app = document.getElementById("app");
document.body.insertBefore(Navbar(), app);
