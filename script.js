// ✅ Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ✅ Chatbot UI Elements
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const btnText = document.getElementById('btnText');
const btnLoader = document.getElementById('btnLoader');

// ✅ MITRE ATT&CK database
const mitreDatabase = {
    'credential_access': {
        techniques: ['T1110 - Brute Force', 'T1555 - Credentials from Password Stores', 'T1003 - OS Credential Dumping'],
        stage: 'Credential Access',
        description: 'Adversary is attempting to obtain account credentials'
    },
    'initial_access': {
        techniques: ['T1566 - Phishing', 'T1190 - Exploit Public-Facing Application', 'T1078 - Valid Accounts'],
        stage: 'Initial Access',
        description: 'Adversary is trying to get into the network'
    },
    'persistence': {
        techniques: ['T1053 - Scheduled Task/Job', 'T1547 - Boot or Logon Autostart Execution', 'T1136 - Create Account'],
        stage: 'Persistence',
        description: 'Adversary is trying to maintain access'
    },
    'defense_evasion': {
        techniques: ['T1070 - Indicator Removal on Host', 'T1027 - Obfuscated Files or Information', 'T1055 - Process Injection'],
        stage: 'Defense Evasion',
        description: 'Adversary is trying to avoid being detected'
    },
    'lateral_movement': {
        techniques: ['T1021 - Remote Services', 'T1091 - Replication Through Removable Media', 'T1210 - Exploitation of Remote Services'],
        stage: 'Lateral Movement',
        description: 'Adversary is moving through the environment'
    },
    'exfiltration': {
        techniques: ['T1041 - Exfiltration Over C2 Channel', 'T1048 - Exfiltration Over Alternative Protocol', 'T1537 - Transfer Data to Cloud Account'],
        stage: 'Exfiltration',
        description: 'Adversary is stealing data'
    }
};

// ✅ Flatten MITRE DB for search
const mitreTechniques = Object.values(mitreDatabase).flatMap(stageObj =>
    stageObj.techniques.map(t => {
        const [id, name] = t.split(" - ");
        return {
            id,
            name,
            description: stageObj.description,
            stage: stageObj.stage
        };
    })
);

// ✅ MITRE Search Function
function searchTechniques() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("results");

    // 🚀 Clear old results
    resultsDiv.innerHTML = "";

    if (!query) return;

    // Filter dataset
    const results = mitreTechniques.filter(tech =>
        tech.id.toLowerCase().includes(query) ||
        tech.name.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        resultsDiv.innerHTML = `<p>No techniques found for "<strong>${query}</strong>"</p>`;
    } else {
        resultsDiv.innerHTML = `<h2>Search Results</h2>`;
        results.forEach(tech => {
            const div = document.createElement("div");
            div.classList.add("result-item");
            div.innerHTML = `<strong>${tech.id} - ${tech.name}</strong><br><small>${tech.description}</small>`;
            resultsDiv.appendChild(div);
        });
    }
}

// ✅ Add chat messages
function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'user' ? 'user-message' : 'bot-message';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? '👤' : '🤖';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';

    if (type === 'user') {
        messageContent.innerHTML = `<strong>You:</strong> ${content}`;
    } else {
        messageContent.innerHTML = content;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ✅ Remediation generator
function generateRemediation(stage) {
    const remediationMap = {
        'Credential Access': 'Immediately reset compromised credentials, enable MFA, monitor for unusual login patterns, and implement account lockout policies.',
        'Initial Access': 'Isolate affected systems, scan for malware, update security awareness training, and strengthen email security controls.',
        'Lateral Movement': 'Segment network traffic, disable unnecessary services, monitor lateral connections, and implement zero-trust architecture.',
        'Exfiltration': 'Block suspicious outbound traffic, secure sensitive data, implement DLP controls, and conduct forensic analysis.',
        'Persistence': 'Remove unauthorized scheduled tasks, scan for backdoors, harden system configurations, and monitor autostart locations.',
        'Defense Evasion': 'Update detection rules, enhance logging, deploy behavioral analytics, and strengthen endpoint protection.'
    };
    return remediationMap[stage] || 'Conduct thorough investigation, implement security best practices, and monitor for suspicious activities.';
}

// ✅ Main analysis function
function performAnalysis(caseDescription) {
    const keywords = caseDescription.toLowerCase();
    let detectedTechniques = [];
    let stage = 'Unknown';
    let riskLevel = 'Medium';
    let riskPercentage = 50;

    // Simple keyword checks
    if (keywords.includes('login') || keywords.includes('password')) {
        detectedTechniques.push(...mitreDatabase.credential_access.techniques);
        stage = 'Credential Access';
        riskPercentage = 75;
        riskLevel = 'High';
    }
    if (keywords.includes('phishing') || keywords.includes('email')) {
        detectedTechniques.push(...mitreDatabase.initial_access.techniques);
        stage = 'Initial Access';
        riskPercentage = 80;
        riskLevel = 'High';
    }
    if (keywords.includes('lateral') || keywords.includes('network')) {
        detectedTechniques.push(...mitreDatabase.lateral_movement.techniques);
        stage = 'Lateral Movement';
        riskPercentage = 85;
        riskLevel = 'High';
    }
    if (keywords.includes('data') || keywords.includes('exfiltration') || keywords.includes('steal')) {
        detectedTechniques.push(...mitreDatabase.exfiltration.techniques);
        stage = 'Exfiltration';
        riskPercentage = 90;
        riskLevel = 'High';
    }

    // Generate remediation steps
    const remediationSteps = generateRemediation(stage);

    // Return formatted HTML
    return `
        <strong>AI Threat Hunter Analysis:</strong>
        <div class="analysis-result">
            <div class="analysis-item">
                <h4>🎯 Primary Attack Stage</h4>
                <p><strong>${stage}</strong> - The adversary appears to be in the ${stage.toLowerCase()} phase of the attack chain.</p>
            </div>
            <div class="analysis-item">
                <h4>🔍 MITRE ATT&CK Techniques</h4>
                <div class="mitre-techniques">
                    ${detectedTechniques.slice(0, 4).map(technique => `<span class="mitre-tag">${technique}</span>`).join('')}
                </div>
            </div>
            <div class="analysis-item">
                <h4>⚠️ Risk Assessment</h4>
                <p><strong>${riskPercentage}% - ${riskLevel} Risk</strong></p>
            </div>
            <div class="analysis-item">
                <h4>🛡️ Recommended Actions</h4>
                <p>${remediationSteps}</p>
            </div>
        </div>
    `;
}

// ✅ Case analysis trigger
function analyzeCase() {
    const caseDescription = chatInput.value.trim();
    
    if (!caseDescription) {
        alert('Please describe your cyber fraud case first.');
        return;
    }

    // Show loading state
    analyzeBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    // Add user message
    addMessage('user', caseDescription);

    // Simulated AI delay
    setTimeout(() => {
        const analysis = performAnalysis(caseDescription);
        addMessage('bot', analysis);

        // Reset button state
        analyzeBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        chatInput.value = '';
    }, 1500);
}

// ✅ Event listeners
analyzeBtn.addEventListener('click', analyzeCase);
chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        analyzeCase();
    }
});

// ✅ Scroll effect for nav
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        nav.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});

// ✅ Hover effects for cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});
