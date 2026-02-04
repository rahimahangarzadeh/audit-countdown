let countdownInterval;
let targetDate;
let currentEventTitle = '';

window.setPreset = function(title, year, month, day, hour, minute, button) {
    targetDate = new Date(year, month - 1, day, hour, minute, 0);
    currentEventTitle = title;
    
    document.getElementById('eventTitle').textContent = title;
    
    // Aktiven Button hervorheben
    document.querySelectorAll('.audit-button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Hintergrundfarbe ändern basierend auf dem Button
    const color = button.getAttribute('data-color');
    document.body.style.background = `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, -30)} 100%)`;
    
    // Countdown-Inhalt erstellen
    const countdownHTML = `
        <div class="event-info" id="eventInfo">
            ${day.toString().padStart(2, '0')}.${month.toString().padStart(2, '0')}.${year} um ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} Uhr
        </div>
        <div class="countdown">
            <div class="time-unit">
                <span class="time-value" id="days">00</span>
                <span class="time-label">Tage</span>
            </div>
            <div class="time-unit">
                <span class="time-value" id="hours">00</span>
                <span class="time-label">Stunden</span>
            </div>
            <div class="time-unit">
                <span class="time-value" id="minutes">00</span>
                <span class="time-label">Minuten</span>
            </div>
            <div class="time-unit">
                <span class="time-value" id="seconds">00</span>
                <span class="time-label">Sekunden</span>
            </div>
        </div>
    `;
    
    document.getElementById('countdownContent').innerHTML = countdownHTML;
    
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        const info = document.getElementById('eventInfo');
        if (info) info.textContent = 'Das Event hat begonnen! 🎉';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

function saveToCalendar() {
    if (!targetDate) {
        alert('Bitte wähle zuerst ein Event aus!');
        return;
    }

    const start = targetDate.toISOString().replace(/-|:|\.\d+/g, '');
    const end = new Date(targetDate.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentEventTitle)}&dates=${start}/${end}`;
    window.open(url, '_blank');
}

function adjustColor(color, amount) {
    const clamp = (num) => Math.min(Math.max(num, 0), 255);
    const num = parseInt(color.replace('#', ''), 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00FF) + amount);
    const b = clamp((num & 0x0000FF) + amount);
    return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}