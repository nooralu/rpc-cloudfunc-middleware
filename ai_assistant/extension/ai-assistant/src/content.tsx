import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Load the extension when the page loads
window.addEventListener("load", loadExtension);

function loadExtension() { 
    const app = document.createElement("div");
    app.id = "ai-assistant-root";
    document.body.appendChild(app);
    ReactDOM.createRoot(app).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}   