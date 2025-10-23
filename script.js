document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });
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

    const infoCardsWithEye = document.querySelectorAll('.info-card:has(.eye-icon)');
    infoCardsWithEye.forEach(card => {
        const eyeIcon = card.querySelector(".eye-icon");
        const valueElement = card.querySelector(".info-value");
        const originalValue = valueElement.innerHTML; // Use innerHTML to preserve sup tags
        let isVisible = true;

        eyeIcon.addEventListener("click", () => {
            if (isVisible) {
                valueElement.textContent = "---";
                eyeIcon.src = "images/eye.svg";
            } else {
                valueElement.innerHTML = originalValue;
                eyeIcon.src = "images/eye-off.svg";
            }
            isVisible = !isVisible;
        });
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

    let reminders = [];
    let editingReminder = null;

    addReminderButton.addEventListener("click", () => {
        editingReminder = null;
        reminderForm.reset();
        document.querySelector("#reminder-modal h2").textContent = "New Reminder";
        reminderModal.style.display = "block";
    });

    newAddReminderButton.addEventListener("click", () => {
        editingReminder = null;
        reminderForm.reset();
        document.querySelector("#reminder-modal h2").textContent = "New Reminder";
        reminderModal.style.display = "block";
    });

    function renderReminders() {
        reminderList.innerHTML = "";
        reminders.forEach(reminder => {
            const reminderItemCard = createReminderCard(reminder);
            reminderList.appendChild(reminderItemCard);
        });
        if (reminders.length > 0) {
            reminderCard.classList.add("has-reminders");
        } else {
            reminderCard.classList.remove("has-reminders");
        }
    }

    function createReminderCard(reminder) {
        const reminderItemCard = document.createElement("div");
        reminderItemCard.classList.add("reminder-item-card");
        reminderItemCard.innerHTML = `
            <div class="reminder-item-main">
                <img src="images/reminder.svg" alt="Reminder Icon" class="reminder-icon">
                <div class="reminder-item-content">
                    <h4>${reminder.name}</h4>
                    <p>Date: ${reminder.date}</p>
                    <p>Time: ${reminder.time}</p>
                    ${reminder.description ? `<p>Description: ${reminder.description}</p>` : ''}
                </div>
            </div>
            <div class="reminder-actions">
                <button class="edit-reminder">Edit</button>
                <button class="delete-reminder">Delete</button>
            </div>
        `;

        reminderItemCard.querySelector(".delete-reminder").addEventListener("click", () => {
            reminders = reminders.filter(r => r.id !== reminder.id);
            renderReminders();
        });

        reminderItemCard.querySelector(".edit-reminder").addEventListener("click", () => {
            editingReminder = reminder;
            document.getElementById("task-name").value = reminder.name;
            document.getElementById("task-date").value = reminder.date;
            document.getElementById("task-time").value = reminder.time;
            document.getElementById("task-description").value = reminder.description;
            document.querySelector("#reminder-modal h2").textContent = "Edit Reminder";
            reminderModal.style.display = "block";
        });

        return reminderItemCard;
    }

    reminderForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const taskName = document.getElementById("task-name").value;
        const taskDate = document.getElementById("task-date").value;
        const taskTime = document.getElementById("task-time").value;
        const taskDescription = document.getElementById("task-description").value;

        if (taskName && taskDate && taskTime) {
            if (editingReminder) {
                editingReminder.name = taskName;
                editingReminder.date = taskDate;
                editingReminder.time = taskTime;
                editingReminder.description = taskDescription;
            } else {
                const newReminder = {
                    id: Date.now(),
                    name: taskName,
                    date: taskDate,
                    time: taskTime,
                    description: taskDescription,
                };
                reminders.push(newReminder);
            }
            renderReminders();
            reminderModal.style.display = "none";
            reminderForm.reset();
        } else {
            alert("Please fill in all required fields.");
        }
    });
});
