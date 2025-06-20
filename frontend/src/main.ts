import { Navbar } from "./components/index.js";
import { LoginPage } from "./pages/index.js";

const app = document.getElementById("app");
app?.appendChild(LoginPage());
document.body.insertBefore(Navbar(), app);
