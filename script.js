document.getElementById("year").textContent = String(new Date().getFullYear());

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  }
}, { threshold: 0.12 });

document.querySelectorAll(".feature, .policy, .roadmap li").forEach((node) => observer.observe(node));
