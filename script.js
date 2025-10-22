document.addEventListener("DOMContentLoaded", function() {
    const attendanceGrid = document.querySelector(".attendance-grid");
    const announcementCards = document.querySelector(".announcement-cards");

    // Populate attendance
    data.attendance.forEach(item => {
        const percentage = ((item.classesAttended / item.classesConducted) * 100).toFixed(1);
        let color;
        if (percentage >= 87) {
            color = "green";
        } else if (percentage >= 76) {
            color = "orange";
        } else {
            color = "red";
        }

        const leavesLeft = Math.floor(item.classesConducted * 0.25) - (item.classesConducted - item.classesAttended);
        const classesToSafe = Math.ceil((0.75 * item.classesConducted - item.classesAttended) / 0.25);

        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        const card = document.createElement("div");
        card.classList.add("attendance-card");

        let attendanceInfo;
        if (percentage > 75) {
            attendanceInfo = `<p class="${color}">You have ${leavesLeft} leaves left!</p>`;
        } else {
            attendanceInfo = `<p class="${color}">You need ${classesToSafe} classes to be safe</p>`;
        }

        card.innerHTML = `
            <div class="card-content">
                <div class="progress-circle ${color}">
                    <span>${percentage}%</span>
                </div>
                <div class="info">
                    <p class="code">${item.code} - ${item.subject}</p>
                    ${attendanceInfo}
                    <p class="class-attended">Class Attended - ${item.classesAttended}/${item.classesConducted}</p>
                    <p class="last-marked">Last marked on - ${formattedDate}</p>
                </div>
            </div>
        `;
        attendanceGrid.appendChild(card);
    });

    // Populate announcements
    data.announcements.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("announcement-card");
        card.innerHTML = `
            <p class="announcement-title">${item.title}</p>
            <p class="announcement-text">${item.text}</p>
        `;
        announcementCards.appendChild(card);
    });

    const eyeIcon = document.querySelector(".eye-icon");
    const cgpaValue = document.querySelector(".info-value");
    const originalCgpa = cgpaValue.textContent;
    let isCgpaVisible = true;

    eyeIcon.addEventListener("click", () => {
        if (isCgpaVisible) {
            cgpaValue.textContent = "---";
            eyeIcon.src = "images/eye.svg";
        } else {
            cgpaValue.textContent = originalCgpa;
            eyeIcon.src = "images/eye-off.svg";
        }
        isCgpaVisible = !isCgpaVisible;
    });

    const switchIcons = document.querySelectorAll(".switch-icon");

    switchIcons.forEach(switchIcon => {
        switchIcon.addEventListener("click", () => {
            const infoCard = switchIcon.closest('.info-card');
            infoCard.classList.toggle('flipped');
        });
    });

    const reminderModal = document.getElementById("reminder-modal");
    const addReminderButton = document.querySelector(".plus-icon-container");
    const newAddReminderButton = document.getElementById("add-reminder-button");
    const closeModalButton = document.querySelector(".close-button");
    const reminderForm = document.getElementById("reminder-form");
    const reminderList = document.querySelector(".reminder-list");
    const reminderCard = document.querySelector(".reminder-card");

    addReminderButton.addEventListener("click", () => {
        reminderModal.style.display = "block";
    });

    newAddReminderButton.addEventListener("click", () => {
        reminderModal.style.display = "block";
    });

    closeModalButton.addEventListener("click", () => {
        reminderModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == reminderModal) {
            reminderModal.style.display = "none";
        }
    });

    reminderForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const taskName = document.getElementById("task-name").value;
        const taskDate = document.getElementById("task-date").value;
        const taskTime = document.getElementById("task-time").value;
        const taskDescription = document.getElementById("task-description").value;

        if (taskName && taskDate && taskTime) {
            const reminderItemCard = document.createElement("div");
            reminderItemCard.classList.add("reminder-item-card");

            reminderItemCard.innerHTML = `
                <img src="images/reminder.svg" alt="Reminder Icon" class="reminder-icon">
                <div class="reminder-item-content">
                    <h4>${taskName}</h4>
                    <p>Date: ${taskDate}</p>
                    <p>Time: ${taskTime}</p>
                    ${taskDescription ? `<p>Description: ${taskDescription}</p>` : ''}
                </div>
            `;

            reminderList.appendChild(reminderItemCard);
            reminderCard.classList.add("has-reminders");
            reminderModal.style.display = "none";
            reminderForm.reset();
        } else {
            alert("Please fill in all required fields.");
        }
    });
});
