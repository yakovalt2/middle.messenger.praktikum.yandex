import "../Loader/Loader.css";

export default function createLoader(): HTMLElement {
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `
      <div class="loader__spinner"></div>
    `;
  return loader;
}
