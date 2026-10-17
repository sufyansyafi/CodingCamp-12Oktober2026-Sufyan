/* ============================================================
   THEME TOGGLE (Dark / Light Mode)
   ============================================================ */

const themeToggle = document.getElementById("theme-toggle");

function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️ Mode Terang";
        themeToggle.setAttribute("aria-label", "Ganti ke mode terang");
    } else {
        document.documentElement.removeAttribute("data-theme");
        themeToggle.textContent = "🌙 Mode Gelap";
        themeToggle.setAttribute("aria-label", "Ganti ke mode gelap");
    }
}

// Muat preferensi tema dari localStorage
let isDarkMode = localStorage.getItem("darkMode") === "true";
applyTheme(isDarkMode);

themeToggle.addEventListener("click", function () {
    isDarkMode = !isDarkMode;
    localStorage.setItem("darkMode", isDarkMode);
    applyTheme(isDarkMode);
});


/* ============================================================
   TANGGAL, JAM, DAN SALAM
   ============================================================ */

const currentDateEl = document.getElementById("current-date");
const currentTimeEl = document.getElementById("current-time");
const greetingEl = document.getElementById("greeting");
const userNameInput = document.getElementById("user-name");
const saveNameButton = document.getElementById("save-name");

// Hari dan bulan dalam bahasa Indonesia
const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

function updateGreeting(name) {
    const jam = new Date().getHours();
    let sapaan;

    if (jam >= 5 && jam < 12) {
        sapaan = "Selamat pagi";
    } else if (jam >= 12 && jam < 15) {
        sapaan = "Selamat siang";
    } else if (jam >= 15 && jam < 18) {
        sapaan = "Selamat sore";
    } else {
        sapaan = "Selamat malam";
    }

    greetingEl.textContent = name ? `${sapaan}, ${name}!` : `${sapaan}!`;
}

function updateClock() {
    const now = new Date();

    // Tanggal
    const hari = HARI[now.getDay()];
    const tgl = now.getDate();
    const bln = BULAN[now.getMonth()];
    const thn = now.getFullYear();
    currentDateEl.textContent = `${hari}, ${tgl} ${bln} ${thn}`;

    // Jam
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    currentTimeEl.textContent = `${hh}:${mm}:${ss}`;
}

// Muat nama dari localStorage
let savedName = localStorage.getItem("userName") || "";
if (savedName) {
    userNameInput.value = savedName;
}
updateGreeting(savedName);
updateClock();
setInterval(updateClock, 1000);

saveNameButton.addEventListener("click", function () {
    const name = userNameInput.value.trim();
    savedName = name;
    localStorage.setItem("userName", name);
    updateGreeting(name);
});

userNameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") saveNameButton.click();
});


/* ============================================================
   POMODORO TIMER
   ============================================================ */

const startButton = document.getElementById("start-timer");
const pauseButton = document.getElementById("pause-timer");
const resetButton = document.getElementById("reset-timer");

const focusInput = document.getElementById("focus-duration");
const breakInput = document.getElementById("break-duration");

const saveFocusButton = document.getElementById("save-duration");
const saveBreakButton = document.getElementById("save-break-duration");

const timerDisplay = document.getElementById("timer-display");
const timerStatus = document.getElementById("timer-status");
const timerMessage = document.getElementById("timer-message");

let focusMinutes = 25;
let breakMinutes = 5;
let remainingSeconds = focusMinutes * 60;
let currentMode = "focus";
let timerInterval = null;
let isRunning = false;

function isValidDuration(value, min, max) {
    const duration = Number(value);
    return (
        String(value).trim() !== "" &&
        Number.isInteger(duration) &&
        duration >= min &&
        duration <= max
    );
}

function updateDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

function updateMessage() {
    if (currentMode === "focus") {
        timerStatus.textContent = "Waktu fokus";
        timerMessage.textContent = "Fokus pada satu tugas dalam satu waktu.";
    } else {
        timerStatus.textContent = "Waktu istirahat";
        timerMessage.textContent = "Istirahat sejenak sebelum fokus kembali.";
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
}

function switchMode() {
    if (currentMode === "focus") {
        currentMode = "break";
        remainingSeconds = breakMinutes * 60;
        timerMessage.textContent = "Sesi fokus selesai! Saatnya istirahat.";
    } else {
        currentMode = "focus";
        remainingSeconds = focusMinutes * 60;
        timerMessage.textContent = "Istirahat selesai! Mari fokus kembali.";
    }
    updateDisplay();
    updateMessage();
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerStatus.textContent = currentMode === "focus" ? "Waktu fokus" : "Waktu istirahat";

    timerInterval = setInterval(function () {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateDisplay();
        } else {
            switchMode();
        }
    }, 1000);
}

function pauseTimer() {
    stopTimer();
    timerStatus.textContent = "Dijeda";
    timerMessage.textContent = "Timer dijeda. Mulai kembali saat siap.";
}

function resetTimer() {
    stopTimer();
    currentMode = "focus";
    remainingSeconds = focusMinutes * 60;
    updateDisplay();
    updateMessage();
    timerMessage.textContent = "Timer direset. Siap memulai sesi fokus baru.";
}

saveFocusButton.addEventListener("click", function () {
    if (!isValidDuration(focusInput.value, 1, 180)) {
        alert("Durasi fokus harus berupa angka bulat 1–180 menit.");
        return;
    }
    focusMinutes = Number(focusInput.value);
    if (currentMode === "focus") {
        stopTimer();
        remainingSeconds = focusMinutes * 60;
        updateDisplay();
    }
    timerMessage.textContent = "Durasi fokus berhasil diperbarui.";
});

saveBreakButton.addEventListener("click", function () {
    if (!isValidDuration(breakInput.value, 5, 60)) {
        alert("Durasi istirahat harus berupa angka bulat 5–60 menit.");
        return;
    }
    breakMinutes = Number(breakInput.value);
    if (currentMode === "break") {
        stopTimer();
        remainingSeconds = breakMinutes * 60;
        updateDisplay();
    }
    timerMessage.textContent = "Durasi istirahat berhasil diperbarui.";
});

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

updateDisplay();
updateMessage();


/* ============================================================
   DAFTAR TUGAS
   ============================================================ */

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const taskFeedback = document.getElementById("task-feedback");
const emptyTasks = document.getElementById("empty-tasks");
const taskSort = document.getElementById("task-sort");

let tasks = [];

try {
    const savedTasks = localStorage.getItem("productivityTasks");
    tasks = savedTasks ? JSON.parse(savedTasks) : [];
    if (!Array.isArray(tasks)) tasks = [];
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("productivityTasks", JSON.stringify(tasks));
}

function renderTasks() {
    taskList.replaceChildren();

    const sortMode = taskSort.value;
    const sortedTasks = [...tasks];

    if (sortMode === "active-first") {
        sortedTasks.sort((a, b) => Number(a.completed) - Number(b.completed));
    } else if (sortMode === "complete-first") {
        sortedTasks.sort((a, b) => Number(b.completed) - Number(a.completed));
    } else if (sortMode === "newest") {
        sortedTasks.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortMode === "oldest") {
        sortedTasks.sort((a, b) => a.createdAt - b.createdAt);
    }

    sortedTasks.forEach(function (task) {
        const item = document.createElement("li");
        item.className = "task-item" + (task.completed ? " is-completed" : "");

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Tandai tugas selesai: " + task.text);

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Teks tugas
        const content = document.createElement("div");
        content.className = "task-content";

        const taskText = document.createElement("p");
        taskText.className = "task-text";
        taskText.textContent = task.text;
        content.appendChild(taskText);

        // Tombol hapus
        const actions = document.createElement("div");
        actions.className = "task-actions";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.setAttribute("aria-label", "Hapus tugas: " + task.text);

        deleteButton.addEventListener("click", function () {
            tasks = tasks.filter(entry => entry.id !== task.id);
            saveTasks();
            renderTasks();
            taskFeedback.textContent = "Tugas berhasil dihapus.";
        });

        actions.appendChild(deleteButton);
        item.append(checkbox, content, actions);
        taskList.appendChild(item);
    });

    const completedCount = tasks.filter(t => t.completed).length;
    taskCount.textContent = `${completedCount}/${tasks.length} selesai`;
    emptyTasks.hidden = tasks.length > 0;
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();
    if (!text) {
        taskFeedback.textContent = "Silakan masukkan tugas terlebih dahulu.";
        return;
    }

    tasks.push({
        id: Date.now() + Math.random(),
        text: text,
        completed: false,
        createdAt: Date.now()
    });

    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskFeedback.textContent = "Tugas berhasil ditambahkan.";
    taskInput.focus();
});

taskSort.addEventListener("change", renderTasks);
renderTasks();


/* ============================================================
   TAUTAN CEPAT
   ============================================================ */

const linkForm = document.getElementById("link-form");
const linkNameInput = document.getElementById("link-name");
const linkUrlInput = document.getElementById("link-url");
const quickLinksContainer = document.getElementById("quick-links");
const linkFeedback = document.getElementById("link-feedback");
const emptyLinks = document.getElementById("empty-links");

let quickLinks = [];

try {
    const savedLinks = localStorage.getItem("productivityQuickLinks");
    quickLinks = savedLinks ? JSON.parse(savedLinks) : [];
    if (!Array.isArray(quickLinks)) quickLinks = [];
} catch {
    quickLinks = [];
}

function saveQuickLinks() {
    localStorage.setItem("productivityQuickLinks", JSON.stringify(quickLinks));
}

function renderQuickLinks() {
    quickLinksContainer.replaceChildren();

    quickLinks.forEach(function (link) {
        const wrapper = document.createElement("div");
        wrapper.className = "quick-link";

        const anchor = document.createElement("a");
        anchor.className = "quick-link-name";
        anchor.textContent = link.name;
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "quick-link-delete";
        deleteButton.textContent = "✕";
        deleteButton.setAttribute("aria-label", "Hapus tautan: " + link.name);

        deleteButton.addEventListener("click", function () {
            quickLinks = quickLinks.filter(entry => entry.id !== link.id);
            saveQuickLinks();
            renderQuickLinks();
            linkFeedback.textContent = "Tautan berhasil dihapus.";
        });

        wrapper.append(anchor, deleteButton);
        quickLinksContainer.appendChild(wrapper);
    });

    emptyLinks.hidden = quickLinks.length > 0;
}

linkForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = linkNameInput.value.trim();
    const url = linkUrlInput.value.trim();

    if (!name || !url) {
        linkFeedback.textContent = "Isi nama situs dan URL terlebih dahulu.";
        return;
    }

    let parsedUrl;
    try {
        parsedUrl = new URL(url);
    } catch {
        linkFeedback.textContent = "URL tidak valid.";
        return;
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        linkFeedback.textContent = "Gunakan URL yang diawali http:// atau https://.";
        return;
    }

    quickLinks.push({
        id: Date.now() + Math.random(),
        name: name,
        url: parsedUrl.href
    });

    saveQuickLinks();
    renderQuickLinks();
    linkForm.reset();
    linkFeedback.textContent = "Tautan berhasil ditambahkan.";
});

renderQuickLinks();
