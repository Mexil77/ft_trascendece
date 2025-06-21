export const Navbar = () => {
	const nav = document.createElement("nav");
	nav.className =
		"p-4 bg-gray-800 text-white flex justify-between items-center";

	const logo = document.createElement("a");
	logo.href = "/";
	logo.textContent = "🏓 Pong";
	logo.className = "text-2xl font-bold";

	const logOut = document.createElement("a");
	logOut.textContent = "logout";
	logOut.href = "/";
	logOut.className = "bg-red-500 border rounded-md p-1";
	logOut.addEventListener("click", () => {
		localStorage.removeItem("authToken");
	});

	nav.appendChild(logo);
	nav.appendChild(logOut);
	return nav;
};
