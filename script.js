document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const generateBtn = document.getElementById('generate-btn');
    const generateYearBtn = document.getElementById('generate-year-btn');
    const calendarContainer = document.getElementById('calendar-container');
    const yearlyContainer = document.getElementById('yearly-container');

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    // Populate dropdowns
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });
    monthSelect.value = currentMonth;

    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        yearlyContainer.innerHTML = '';
        generateCalendar(parseInt(monthSelect.value), parseInt(yearSelect.value));
    });

    generateYearBtn.addEventListener('click', () => {
        calendarContainer.innerHTML = '';
        yearlyContainer.innerHTML = `<h2>Jadwal 1 Tahun Penuh (${yearSelect.value})</h2>`;
        for(let i=0; i<12; i++) {
            generateCalendar(i, parseInt(yearSelect.value), true);
        }
    });

    // --- LOGIC PENJADWALAN (UPDATED FOR BENGKONG BARRIER) ---
    function getTasksForDate(day, dayOfWeek, weekOfMonth, isLastWeek) {
        let tasks = [];
        // dayOfWeek: 0=Minggu, 1=Senin, ..., 6=Sabtu

        // TUGAS RUTIN NON-SHOOTING MINGGUAN
        switch (dayOfWeek) {
            case 1: // Senin
                tasks.push({ text: "Weekly 1on1 with SocMed Manager", type: "meeting" });
                break;
            case 2: // Selasa
                tasks.push({ text: "Olah & sortir footage", type: "postprod" });
                break;
            case 3: // Rabu
                // Hari shooting, tugas spesifik diatur di bawah
                break;
            case 4: // Kamis
                tasks.push({ text: "Select 10 best raw photos/videos", type: "postprod" });
                tasks.push({ text: "Provide landscape & portrait version", type: "postprod" });
                break;
            case 5: // Jumat
                tasks.push({ text: "Editing Day", type: "editing" });
                break;
        }

        // TUGAS SPESIFIK MINGGUAN (SHOOTING & EDITING)
        switch (weekOfMonth) {
            case 1: // MINGGU 1: FOKUS TIM LOKASI TETAP
                if (dayOfWeek === 1) tasks.push({ text: "Plan & Prepare Weekly Shoot", type: "meeting" });
                if (dayOfWeek === 2) tasks.push({ text: "SHOOT: Tim Lele (Bengkong) - Barrier Penuh", type: "shooting" }); // PINDAH KE SELASA
                if (dayOfWeek === 3) tasks.push({ text: "SHOOT: Tim Walrus (Tanjung Uma)", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "SHOOT: Tim Oyster (Setokok)", type: "shooting" });
                if (dayOfWeek === 5) tasks.push({ text: "Edit 'Plastic Adventure of the Month' & 1 video", type: "editing" });
                break;
                
            case 2: // MINGGU 2: FOKUS TIM BERGERAK & PROGRES AWAL
                if (dayOfWeek === 1) tasks.push({ text: "SHOOT: Tim Dugong (Moving)", type: "shooting" });
                if (dayOfWeek === 3) tasks.push({ text: "SHOOT: Tim Jellyfish (Moving)", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "SHOOT: Tim Lele (Bengkong) - Barrier Penuh", type: "shooting" }); // TETAP DI KAMIS
                if (dayOfWeek === 5) {
                    tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" });
                    tasks.push({ text: "Edit Crew Profile/Interview Video", type: "special" });
                }
                break;

            case 3: // MINGGU 3: LIPUTAN PROGRES LANJUTAN
                if (dayOfWeek === 1) tasks.push({ text: "SHOOT: Tim Walrus (Tanjung Uma) - Progres", type: "shooting" });
                if (dayOfWeek === 3) tasks.push({ text: "SHOOT: Tim Oyster (Setokok) - Progres", type: "shooting" });
                if (dayOfWeek === 4) tasks.push({ text: "SHOOT: Tim Dugong (Moving)", type: "shooting" });
                 if (dayOfWeek === 5) {
                    tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" });
                    tasks.push({ text: "Edit 'Day-in-the-Life' Video", type: "special" });
                }
                break;

            case 4: // MINGGU 4: FINALISASI & KPI KHUSUS
                if (dayOfWeek === 1) tasks.push({ text: "SHOOT: Tim Jellyfish (Moving)", type: "shooting" });
                if (dayOfWeek === 3) tasks.push({ text: "SHOOT: Fokus MRF & Profil Kru", type: "special" });
                if (dayOfWeek === 4) tasks.push({ text: "SHOOT: Fleksibel (Area Terpencil/Budaya)", type: "special" });
                if (dayOfWeek === 5) {
                    tasks.push({ text: "Edit 2-3 requested simple videos", type: "editing" });
                    tasks.push({ text: "Mulai edit Video Summary Bulan Ini", type: "editing" });
                }
                break;
        }

        // TUGAS AKHIR BULAN
        if (isLastWeek && dayOfWeek === 5) {
             tasks.push({ text: "Finalisasi Video Summary Bulan Ini", type: "special" });
        }
        if (day === 1 && dayOfWeek > 0 && dayOfWeek < 6) {
            tasks.push({ text: "Publish Video Summary Bulan Lalu", type: "special" });
        }

        return tasks;
    }


    // --- FUNGSI GENERATE KALENDER (Tidak ada perubahan di sini) ---
    function generateCalendar(month, year, forYearlyView = false) {
        const firstDay = new new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay(); // 0 for Sunday

        const calendar = document.createElement('div');
        calendar.className = 'calendar';
        
        const monthHeader = document.createElement('h3');
        monthHeader.textContent = `${months[month]} ${year}`;
        monthHeader.style.textAlign = 'center';
        monthHeader.style.gridColumn = '1 / -1';
        monthHeader.style.margin = '15px 0';
        
        if (forYearlyView) {
            yearlyContainer.appendChild(monthHeader);
        } else {
             calendarContainer.innerHTML = ''; // Clear previous calendar
             calendarContainer.appendChild(monthHeader);
        }
       
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        dayNames.forEach(name => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-header';
            dayHeader.textContent = name;
            calendar.appendChild(dayHeader);
        });

        for (let i = 0; i < startDayOfWeek; i++) {
            calendar.appendChild(document.createElement('div'));
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            const date = new Date(year, month, i);
            const dayOfWeek = date.getDay();
            
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add('weekend');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = i;
            dayCell.appendChild(dayNumber);
            
            const tasksContainer = document.createElement('div');
            tasksContainer.className = 'tasks';
            
            const weekOfMonth = Math.ceil((i + startDayOfWeek) / 7);
            const isLastWeek = (new Date(year, month, i + 7).getMonth() !== month);

            const tasks = getTasksForDate(i, dayOfWeek, weekOfMonth, isLastWeek);
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `task task-${task.type}`;
                taskElement.innerHTML = `<span class="task-dot"></span>${task.text}`;
                tasksContainer.appendChild(taskElement);
            });
            
            dayCell.appendChild(tasksContainer);
            calendar.appendChild(dayCell);
        }

        if (forYearlyView) {
            yearlyContainer.appendChild(calendar);
        } else {
            calendarContainer.appendChild(calendar);
        }
    }
    
    // Generate calendar for the current month on initial load
    generateCalendar(currentMonth, currentYear);
});