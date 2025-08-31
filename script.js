document.addEventListener('DOMContentLoaded', () => {
    // Welcome page logic
    if (document.getElementById('welcome-page') && !document.getElementById('login-page')) {
        setTimeout(() => {
            window.location.href = 'login.html'; // Redirect to login page
        }, 4000); // 4 seconds
    }

    // Login page logic
    if (document.getElementById('login-page')) {
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const gmailBtn = document.getElementById('gmail-btn');
        const xBtn = document.getElementById('x-btn');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const errorMessage = document.getElementById('error-message');
        const loadingAnimation = document.getElementById('loading-animation');

        // Simulated authentication
        function handleAuth(isLogin = false) {
            if (isLogin) {
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                if (username === '' || password === '') {
                    errorMessage.textContent = 'Please enter both username and password';
                    errorMessage.style.display = 'block';
                    return;
                }
            }
            errorMessage.style.display = 'none';
            loadingAnimation.style.display = 'flex';
            setTimeout(() => {
                window.location.href = 'index.html'; // Redirect to main app
            }, 2000); // Show dragon animation for 2 seconds
        }

        loginBtn.addEventListener('click', () => handleAuth(true));
        signupBtn.addEventListener('click', () => handleAuth(false));
        gmailBtn.addEventListener('click', () => handleAuth(false));
        xBtn.addEventListener('click', () => handleAuth(false));
    }

    // Main app logic (for index.html)
    if (document.getElementById('main-content')) {
        // DOM Elements
        const notificationBtn = document.getElementById('notification-btn');
        const notificationCount = document.getElementById('notification-count');
        const notificationState = document.getElementById('notification-state');
        const darkModeBtn = document.getElementById('dark-mode-btn');
        const aboutBtn = document.getElementById('about-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const aboutModal = document.getElementById('about-modal');
        const sidebar = document.getElementById('sidebar');
        const goalInput = document.getElementById('goal-input');
        const goalType = document.getElementById('goal-type');
        const addGoalBtn = document.getElementById('add-goal');
        const goalList = document.getElementById('goal-list');
        const sectionTitle = document.getElementById('section-title');
        const tabs = document.querySelectorAll('.tab');

        // Load goals and notification state from localStorage
        let goals = JSON.parse(localStorage.getItem('goals')) || [];
        let notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
        let currentTab = 'daily';

        // Update notification count and state
        function updateNotificationCount() {
            const incompleteGoals = goals.filter(goal => !goal.completed).length;
            notificationCount.textContent = incompleteGoals;
            notificationCount.style.display = notificationsEnabled ? 'inline' : 'none';
            notificationState.textContent = notificationsEnabled ? 'On' : 'Off';
        }

        // Toggle notifications
        notificationBtn.addEventListener('click', () => {
            notificationsEnabled = !notificationsEnabled;
            localStorage.setItem('notificationsEnabled', notificationsEnabled);
            updateNotificationCount();
        });

        // Render goals based on current tab
        function renderGoals() {
            goalList.innerHTML = '';
            sectionTitle.textContent = currentTab === 'achievements' ? 'Past Achievements' : `${currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} Goals`;

            const filteredGoals = currentTab === 'achievements' 
                ? goals.filter(goal => goal.completed)
                : goals.filter(goal => goal.type === currentTab && !goal.completed);

            filteredGoals.forEach(goal => {
                const goalCard = document.createElement('div');
                goalCard.classList.add('goal-card');
                if (goal.completed) goalCard.classList.add('completed');

                goalCard.innerHTML = `
                    <span>${goal.text} ${goal.completed && goal.dateCompleted ? `<small>(Completed: ${goal.dateCompleted})</small>` : ''}</span>
                    <div>
                        ${!goal.completed ? `<button onclick="markComplete(${goal.id})">Complete</button>` : ''}
                        <button onclick="editGoal(${goal.id})">Edit</button>
                        <button onclick="deleteGoal(${goal.id})">Delete</button>
                    </div>
                `;
                goalList.appendChild(goalCard);
            });

            updateNotificationCount();
        }

        // Add new goal
        addGoalBtn.addEventListener('click', () => {
            const text = goalInput.value.trim();
            if (text === '') return alert('Please enter a goal!');

            const newGoal = {
                id: Date.now(),
                text,
                type: goalType.value,
                completed: false,
                dateCreated: new Date().toLocaleDateString(),
                dateCompleted: null
            };

            goals.push(newGoal);
            localStorage.setItem('goals', JSON.stringify(goals));
            goalInput.value = '';
            renderGoals();
        });

        // Mark goal as complete
        window.markComplete = (id) => {
            goals = goals.map(goal => 
                goal.id === id ? { ...goal, completed: true, dateCompleted: new Date().toLocaleDateString() } : goal
            );
            localStorage.setItem('goals', JSON.stringify(goals));
            renderGoals();
        };

        // Edit goal
        window.editGoal = (id) => {
            const newText = prompt('Edit your goal:', goals.find(goal => goal.id === id).text);
            if (newText && newText.trim()) {
                goals = goals.map(goal => 
                    goal.id === id ? { ...goal, text: newText.trim() } : goal
                );
                localStorage.setItem('goals', JSON.stringify(goals));
                renderGoals();
            }
        };

        // Delete goal
        window.deleteGoal = (id) => {
            if (confirm('Are you sure you want to delete this goal?')) {
                goals = goals.filter(goal => goal.id !== id);
                localStorage.setItem('goals', JSON.stringify(goals));
                renderGoals();
            }
        };

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                currentTab = tab.dataset.tab;
                renderGoals();
            });
        });

        // Toggle Dark Mode
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Logout
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'login.html'; // Redirect to login page, retain localStorage
        });

        // Load dark mode preference
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }

        // Show About Modal
        aboutBtn.addEventListener('click', () => {
            aboutModal.style.display = 'flex';
        });

        // Close Modal
        window.closeModal = () => {
            aboutModal.style.display = 'none';
        };

        // Toggle Sidebar (for mobile)
        window.toggleSidebar = () => {
            sidebar.classList.toggle('active');
        };

        // Initial render
        updateNotificationCount();
        renderGoals();
    }
});