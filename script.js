// "Жоғары" түймесіне арналған шағын анимация
const scrollBtn = document.createElement("button");
scrollBtn.textContent = "↑";
scrollBtn.className = "scroll-top";
document.body.appendChild(scrollBtn);

scrollBtn.style.cssText = `
position: fixed;
bottom: 25px;
right: 25px;
background: #7f5cff;
color: white;
border: none;
border-radius: 50%;
width: 40px;
height: 40px;
cursor: pointer;
display: none;
`;

window.addEventListener("scroll", () => {
  scrollBtn.style.display = window.scrollY > 200 ? "block" : "none";
});

scrollBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
