// --- SCROLL DOWN FOR HERO ARROW ---
function scrollDown() {
    const nextSection = document.getElementById("start");
    nextSection.scrollIntoView({ behavior: 'smooth' });
}

// --- COUNTDOWN LOGIC ---
const weddingDate = new Date("2026-10-10T08:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;
    if (diff <= 0) {
        document.getElementById("countdown").innerHTML = "<h3>Slavlje je počelo!</h3>";
        return;
    }
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = d.toString().padStart(2, '0');
    document.getElementById("hours").innerText = h.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
    document.getElementById("seconds").innerText = s.toString().padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- BACK TO TOP ---
const backToTopBtn = document.getElementById("backToTop");
window.onscroll = function() {
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};
backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- MUSIC ---
function toggleMusic() {
    const audio = document.getElementById("bgMusic");
    const icon = document.getElementById("musicIcon");
    if (audio.paused) {
        audio.play();
        icon.classList.replace("fa-play", "fa-pause");
    } else {
        audio.pause();
        icon.classList.replace("fa-pause", "fa-play");
    }
}

// --- VIRTUAL TOAST WITH LOCAL STORAGE ---
function loadToasts() {
    const savedToasts = JSON.parse(localStorage.getItem("weddingToasts")) || [];
    const display = document.getElementById("toastDisplay");
    display.innerHTML = "";
    savedToasts.forEach(toast => {
        const card = document.createElement("div");
        card.className = "toast-card";
        card.innerHTML = `<strong>${toast.name}</strong><p>${toast.msg}</p>`;
        display.prepend(card);
    });
}

// --- TOASTS WITH GOOGLE SHEETS ---
async function sendToast() {
    const name = document.getElementById("guestName").value;
    const msg = document.getElementById("guestMessage").value;
    const url = "https://script.google.com/macros/s/AKfycbye1y2oEdK0Vxp6qF4heQq4jmi2QnQMGmWhZqezs14IyZTBn67eXDF12COPwlj6i0-Y/exec"; // <-- ZALIJEPI SVOJ LINK OVDJE

    if (name.trim() === "" || msg.trim() === "") {
        alert("Molimo unesite vaše ime i poruku! ✨");
        return;
    }

    const button = document.querySelector(".btn-green");
    button.disabled = true;
    button.innerText = "Slanje...";

    try {
        const response = await fetch(url, {
            method: "POST",
            mode: "no-cors", // Važno zbog sigurnosnih postavki browsera
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, msg })
        });

        // Pošto koristimo no-cors, ne možemo pročitati JSON odgovor, 
        // ali možemo pretpostaviti da je prošlo ako nema errora.
        alert("Hvala vam! Poruka je sačuvana. 🥂");
        
        // Lokalno spremanje (da se odmah vidi na ekranu)
        const savedToasts = JSON.parse(localStorage.getItem("weddingToasts")) || [];
        savedToasts.push({ name, msg });
        localStorage.setItem("weddingToasts", JSON.stringify(savedToasts));
        
        loadToasts();
        document.getElementById("guestName").value = "";
        document.getElementById("guestMessage").value = "";
        
    } catch (error) {
        console.error("Greška:", error);
        alert("Nesto nije u redu. Pokušajte ponovo.");
    } finally {
        button.disabled = false;
        button.innerText = "Pošalji čestitku 🥂";
    }
}

// Initial Load
window.onload = loadToasts;

// --- SCROLL REVEAL ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));