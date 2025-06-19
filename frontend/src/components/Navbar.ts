export const Navbar = () => {
	const nav = document.createElement("nav");
	nav.className =
		"p-4 bg-gray-800 text-white flex justify-between items-center";

	const logo = document.createElement("a");
	logo.href = "/";
	logo.textContent = "🏓 Pong";
	logo.className = "text-2xl font-bold";

	nav.appendChild(logo);
	return nav;
};
