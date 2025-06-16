const app = document.getElementById("app");
const div = document.createElement("div");
const card = document.createElement("button");
card.className =
	"card w-64 h-80 bg-gray-800 text-white p-6 rounded-lg shadow-lg relative overflow-hidden transition-transform duration-300 hover:scale-105";
card.textContent = "click";
card.addEventListener("click", () => {
	fetch("http://localhost:3000/ping")
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Error en la respuesta: ${response.status}`);
			}
			return response.text();
		})
		.then((data) => {
			console.log("Respuesta del servidor:", data);
		})
		.catch((error) => {
			console.error("Hubo un problema con el fetch:", error);
		});
});
div.appendChild(card);
document.body.insertBefore(div, app);
