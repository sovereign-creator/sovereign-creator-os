// Sovereign Creator OS - Production Grade Core System
let projectCount = parseInt(localStorage.getItem('projectCount')) || 3;
let compassionScores = JSON.parse(localStorage.getItem('compassionScores')) || {
    metta: 7, karuna: 6, mudita: 8, upekkha: 5
};
let revenueStreams = JSON.parse(localStorage.getItem('revenueStreams')) || {
    art: 1200, subscriptions: 450, ecosystem: 300, institutional: 0
};
let autopilotEnabled = JSON.parse(localStorage.getItem('autopilotEnabled')) || false;

let isFirstVisit = !localStorage.getItem('hasVisitedBefore');

// ==================== CORE SYSTEM FUNCTIONS ====================

// Centralized State Persistence
function persistState() {
    localStorage.setItem('projectCount', projectCount);
    localStorage.setItem('compassionScores', JSON.stringify(compassionScores));
    localStorage.setItem('revenueStreams', JSON.stringify(revenueStreams));
    localStorage.setItem('autopilotEnabled', JSON.stringify(autopilotEnabled));
}

// System Reset with Safety Confirmation
function resetSystem() {
    if (confirm('Reset system to zero? This will clear all progress.')) {
        localStorage.clear();
        projectCount = 0;
        compassionScores = { metta: 0, karuna: 0, mudita: 0, upekkha: 0 };
        revenueStreams = { art: 0, subscriptions: 0, ecosystem: 0, institutional: 0 };
        autopilotEnabled = false;

        updateProjectDisplay();
        updateCompassionDisplay();
        updateRevenueDisplay();
        updateTotalRevenue();
        updateAutopilotIndicator();

        showGrowthMessage('🔄 System Reset Complete! Fresh start activated.');
    }
}

// ==================== AUTOPILOT SYSTEM ====================

function toggleAutopilot() {
    autopilotEnabled = !autopilotEnabled;
    persistState();

    if (autopilotEnabled) {
        startAutopilot();
        showGrowthMessage('🤖 Autopilot Enabled - System growing autonomously!');
    } else {
        showGrowthMessage('⏸️ Autopilot Disabled - You have full control.');
    }
    updateAutopilotIndicator();
}

function startAutopilot() {
    if (!autopilotEnabled) return;

    // Wait for DOM readiness
    if (!document.body) {
        return setTimeout(startAutopilot, 1000);
    }

    // Random growth events
    const events = [
        () => {
            projectCount++;
            updateProjectDisplay();
            updateRevenue('art', projectCount * 100);
            showGrowthMessage('🎨 Autopilot: New creative project launched!');
        },
        () => {
            const metrics = Object.keys(compassionScores);
            const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
            updateCompassion(randomMetric);
        },
        () => {
            const growth = Math.floor(Math.random() * 200) + 50;
            updateRevenue('subscriptions', revenueStreams.subscriptions + growth);
            showGrowthMessage('📈 Autopilot: Subscription revenue growing!');
        },
        () => {
            const growth = Math.floor(Math.random() * 100) + 25;
            updateRevenue('ecosystem', revenueStreams.ecosystem + growth);
            showGrowthMessage('🌐 Autopilot: Ecosystem services expanding!');
        }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent();

    const nextInterval = Math.random() * 10000 + 5000;
    setTimeout(startAutopilot, nextInterval);
}

function updateAutopilotIndicator() {
    let indicator = document.getElementById('autopilot-indicator');
    if (!indicator) return; // Safety guard

    indicator.textContent = autopilotEnabled ?
        '🤖 Autopilot: ON' : '⏸️ Autopilot: OFF';
    indicator.style.background = autopilotEnabled ? '#48bb78' : '#ed8936';
}

// ==================== CORE INTERACTIONS ====================

function incrementProjects() {
    projectCount++;
    persistState();
    updateProjectDisplay();
    updateRevenue('art', projectCount * 100);
    showGrowthMessage('Creative project added!');
}

function updateProjectDisplay() {
    const completion = Math.min(projectCount * 25, 100);
    const projectText = projectCount === 0 ?
        '0 Projects • 0% Complete' :
        `${projectCount} Project${projectCount !== 1 ? 's' : ''} • ${completion}% Complete`;

    const metricElement = document.getElementById('project-metric');
    if (metricElement) metricElement.textContent = projectText;
}

function updateCompassion(metric) {
    compassionScores[metric] = Math.min(compassionScores[metric] + 1, 10);
    persistState();

    const pill = document.querySelector(`[data-metric="${metric}"]`);
    if (!pill) return; // Safety guard

    pill.querySelector('span').textContent = compassionScores[metric];
    pill.classList.add('active');
    setTimeout(() => pill.classList.remove('active'), 1000);

    const compassionTotal = Object.values(compassionScores).reduce((a, b) => a + b);
    updateRevenue('subscriptions', compassionTotal * 15);

    showGrowthMessage(`${metric.charAt(0).toUpperCase() + metric.slice(1)} compassion increased!`);
}

function updateCompassionDisplay() {
    Object.keys(compassionScores).forEach(metric => {
        const pill = document.querySelector(`[data-metric="${metric}"]`);
        if (pill) {
            pill.querySelector('span').textContent = compassionScores[metric];
        }
    });
}

function updateRevenue(stream, amount) {
    revenueStreams[stream] = amount;
    persistState();

    const element = document.querySelector(`[data-stream="${stream}"] .revenue-amount`);
    if (!element) return; // Safety guard

    element.textContent = `$${amount}`;
    element.classList.add('updated');
    setTimeout(() => element.classList.remove('updated'), 1000);

    updateTotalRevenue();
}

function updateRevenueDisplay() {
    Object.keys(revenueStreams).forEach(stream => {
        const element = document.querySelector(`[data-stream="${stream}"] .revenue-amount`);
        if (element) {
            element.textContent = `$${revenueStreams[stream]}`;
        }
    });
}

function updateTotalRevenue() {
    const total = Object.values(revenueStreams).reduce((a, b) => a + b, 0);
    const totalElement = document.getElementById('total-amount');
    if (!totalElement) return; // Safety guard

    totalElement.textContent = `$${total}`;

    // Celebrate milestones
    if (total >= 1000 && total < 1001) {
        showGrowthMessage('🎉 $1,000 Revenue Milestone!');
    }
}

// ==================== UI ENHANCEMENTS ====================

function showGrowthMessage(message) {
    const msg = document.createElement('div');
    msg.className = 'growth-message';
    msg.textContent = message;
    document.body.appendChild(msg);

    // Smooth fade in/out
    setTimeout(() => msg.classList.add('visible'), 10);
    setTimeout(() => msg.classList.remove('visible'), 2800);
    setTimeout(() => msg.remove(), 3200);
}

function setupControlPanel() {
    const toggleBtn = document.getElementById('toggle-controls');
    const controlPanel = document.getElementById('control-panel');

    if (toggleBtn && controlPanel) {
        toggleBtn.addEventListener('click', function () {
            const isVisible = controlPanel.style.display === 'block';
            controlPanel.style.display = isVisible ? 'none' : 'block';
            toggleBtn.textContent = isVisible ? '🎮 Show Controls' : '🎮 Hide Controls';
        });
    }
}

function enableDemoMode() {
    const demoIndicator = document.createElement('div');
    demoIndicator.textContent = '✨ Demo Mode Active';
    demoIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #9f7aea;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.8rem;
        z-index: 1000;
        opacity: 0.7;
    `;
    document.body.appendChild(demoIndicator);
}

// ==================== DATA MANAGEMENT ====================

function exportData() {
    const data = {
        projectCount,
        compassionScores,
        revenueStreams,
        lastUpdated: new Date().toISOString()
    };
    const json = JSON.stringify(data, null, 2);

    // Try to copy to clipboard
    navigator.clipboard?.writeText(json).then(() => {
        showGrowthMessage('📦 Data copied to clipboard!');
    }).catch(() => {
        showGrowthMessage('📦 Data ready for export!');
    });

    return json;
}

// ==================== INITIALIZATION ====================

function initializeDashboard() {
    updateProjectDisplay();
    updateCompassionDisplay();
    updateRevenueDisplay();
    updateTotalRevenue();
    updateAutopilotIndicator();

    if (autopilotEnabled) {
        startAutopilot();
    }

    // Delayed welcome message for better UX
    setTimeout(() => {
        if (isFirstVisit) {
            localStorage.setItem('hasVisitedBefore', 'true');
            showGrowthMessage('🚀 Welcome to Your Sovereign Creator OS! Impressive start already!');
        } else {
            showGrowthMessage('📊 Welcome back! Your empire continues to grow.');
        }
    }, 500);
}

// ==================== START EVERYTHING ====================

document.addEventListener('DOMContentLoaded', function () {
    initializeDashboard();
    enableDemoMode();
    setupControlPanel();

    // Add control buttons to footer
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset System';
    resetBtn.className = 'demo-button';
    resetBtn.style.margin = '0 0.5rem';
    resetBtn.addEventListener('click', resetSystem);

    const autopilotBtn = document.createElement('button');
    autopilotBtn.textContent = 'Toggle Autopilot';
    autopilotBtn.className = 'demo-button';
    autopilotBtn.addEventListener('click', toggleAutopilot);

    const footer = document.querySelector('footer p');
    if (footer) {
        footer.appendChild(resetBtn);
        footer.appendChild(autopilotBtn);
    }

    // Compassion pill interactions
    document.querySelectorAll('.compassion-pill').forEach(pill => {
        pill.addEventListener('click', function () {
            const metric = this.getAttribute('data-metric');
            updateCompassion(metric);
        });
    });

    // Enhanced navigation with smooth scrolling
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Smooth scroll to section
            const targetId = this.getAttribute('href')?.replace('#', '');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    incrementProjects();
                    break;
                case '2':
                    e.preventDefault();
                    updateCompassion('metta');
                    break;
                case '0':
                    e.preventDefault();
                    resetSystem();
                    break;
                case 'a':
                    e.preventDefault();
                    toggleAutopilot();
                    break;
                case 'e':
                    e.preventDefault();
                    exportData();
                    break;
            }
        }
    });
});// JavaScript source code
