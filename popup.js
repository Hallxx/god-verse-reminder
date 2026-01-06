// lista de los versiculos que se van a mostrar
const versiculos = [
    { texto: "Les dejo un regalo: paz en la mente y en el corazón. Y la paz que yo doy es un regalo que el mundo no puede dar. Así que no se angustien ni tengan miedo.", referencia: "Juan 14:27 (NTV)" },
    { texto: "No se dejen engañar: nadie puede burlarse de la justicia de Dios. Siempre se cosecha lo que se siembra.", referencia: "Gálatas 6:7 (NTV)" },
    { texto: "El Señor está de mi parte, por tanto, no temeré. ¿Qué me puede hacer un simple mortal?", referencia: "Salmos 118:6 (NTV)" },
    { texto: "Y hagan todo con amor.", referencia: "1 Corintios 16:14 (NTV)" },
    { texto: "Estén siempre alegres.", referencia: "1 Tesalonicenses 5:16 (NTV)" },
    { texto: "Tu palabra es una lámpara que guía mis pies y una luz para mi camino.", referencia: "Salmos 119:105 (NTV)" },
    { texto: "Nos amamos unos a otros, porque él nos amó primero.", referencia: "1 Juan 4:19 (NTV)" },
    { texto: "El Señor es mi pastor; tengo todo lo que necesito.", referencia: "Salmos 23:1 (NTV)" },
];

//esperar a que el DOM cargue
document.addEventListener("DOMContentLoaded", () => {

    const countdownEl = document.getElementById("countdown");

function startCountdown() {
    const timer = setInterval(() => {
        chrome.storage.local.get("nextVerseTime", (data) => {
            if (!data.nextVerseTime) {
                countdownEl.textContent = "";
                clearInterval(timer);
                return;
            }

            const diff = data.nextVerseTime - Date.now();

            if (diff <= 0) {
                countdownEl.textContent = "New verse now 📖";
                clearInterval(timer);
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            countdownEl.textContent =
                `Next verse in: ${minutes}:${seconds.toString().padStart(2, "0")}`;
        });
    }, 1000);
}

// mandar el mensaje del boton start
document.getElementById("start").addEventListener("click", () => {
    // primero pedir permiso de notificaciones
     chrome.permissions.request(
    { permissions: ["notifications"] },
    (granted) => {
      if (!granted) {
        alert("Debes permitir notificaciones");
        return;
      }

      // aquí adentro:
    // 1. obtén el valor de minutes
    const minutos = parseInt(document.getElementById("minutes").value);
    // 2. crea un objeto con action y minutos
    const message = {
        action: "start",
        minutos: minutos,
    }
    // 3. envía con chrome.runtime.sendMessage()
    chrome.runtime.sendMessage(message);
});

document.getElementById("reset").addEventListener("click", () => {
    // aquí adentro: casi lo mismo que el start de arriba

    // unicament es hacer la action reset para que en el bacckground.js se detenga todo con el clearInterval
    const message = {
        action: "reset",
    }

    chrome.runtime.sendMessage(message);
})

startCountdown();
})});