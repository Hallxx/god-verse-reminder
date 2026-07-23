// Request notification permission when extension loads
chrome.runtime.onInstalled.addListener(() => {

  chrome.notifications.getPermissionLevel(level => {
    console.log("Notification level:", level);
  });
});

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
    { texto: "Estén siempre alegres.", referencia: "1 Tesalonicenses 5:16 (NTV)" },
    { texto: "Nunca dejen de orar", referencia: "1 Tesalonicenses 5:17 (NTV)" },
    { texto: "Podremos tirar los dados, pero el Señor decide cómo caen.", referencia: "Proverbios 16:33  (NTV)" },
];

// funcion para devolver un versiculo aleatorio 
function getVersiculo() {
    return versiculos[Math.floor(Math.random() * versiculos.length)];
}

console.log("🟢 background.js cargado correctamente");

// funcion para mostrar la notificación del versiculo
function mostrarNotificacion() {
    console.log("📢 Intentando mostrar notificación...");

    const versiculoRandom = getVersiculo();
    console.log("📖 Versículo seleccionado:", versiculoRandom);

    // aquí va el código para mostrar la notificación

    chrome.notifications.create(
        `GodVerse_${Date.now()}`,
        {
            type: "basic",
            iconUrl: "cruz_logo.png",
            title: "God Verse Reminder",
            message: `${versiculoRandom.texto} - ${versiculoRandom.referencia}`,
            priority: 2,
            requireInteraction: true
        }
    )
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📨 Mensaje recibido:", message);
    
    
    if (message.action === "start") {
        const minutos = message.minutos;
        
        console.log("▶️ Acción START detectada");
        // aquí escribes qué pasa cuando inicia
        // 1. obtén los minutos: message.minutos
        
        
        // al parecer el setInterval es malo en Manifest V3, por ende lo voy a cambiar por chrome.alarms
        
        // 2. convierte a milisegundos (minutos * 60 * 1000)
        // const miliSegundos = minutos * 60 * 1000;
        // // 3. llama mostrarNotificacion() AHORA
        // mostrarNotificacion();
        // // 4. usa setInterval() para hacerlo cada X milisegundos
        // notificacionInterval = setInterval(mostrarNotificacion, miliSegundos);
        
        // crear alarma que se repita cada X minutos

        chrome.alarms.clear("verseReminderAlarm", () => {
        chrome.alarms.create("verseReminderAlarm", {
            periodInMinutes: minutos,
        });

        mostrarNotificacion();
        sendResponse({ success: true });
        });

        const nextTime = Date.now() + minutos * 60 * 1000;

        chrome.storage.local.set({
            nextVerseTime: nextTime,
            intervalMinutes: minutos
        });

        // startCountdown();


        return true; // 🔥 CRÍTICO
    }
        
    if (message.action === "reset") {
            console.log("⏹️ Acción RESET detectada");
            // aquí detiene todo
            // usar el chrome clear alarms
            chrome.alarms.clear("verseReminderAlarm");

            chrome.storage.local.remove(["nextVerseTime", "intervalMinutes"]);

            return true; // 🔥 CRÍTICO
        }
    });

    // escuchar la alarma
    chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === "verseReminderAlarm") { 
            mostrarNotificacion();
        }
});