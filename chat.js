// TEMP scheme data (later pass dynamically)
const scheme = JSON.parse(localStorage.getItem("selectedScheme"));

// Remove welcome message on first interaction
let firstMessage = true;

function askQuestion(question) {
    document.getElementById("question").value = question;
    sendMessage();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const questionInput = document.getElementById("question");
    const question = questionInput.value.trim();

    if (!question) return;

    const chatBox = document.getElementById("chatBox");
    
    // Remove welcome message on first interaction
    if (firstMessage) {
        chatBox.innerHTML = '';
        firstMessage = false;
    }

    // Add user message
    const userMessage = `
        <div class="message user">
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <div class="message-label">You</div>
                ${escapeHtml(question)}
            </div>
        </div>
    `;
    chatBox.innerHTML += userMessage;

    // Add typing indicator
    const typingIndicator = `
        <div class="message bot" id="typingIndicator">
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `;
    chatBox.innerHTML += typingIndicator;
    chatBox.scrollTop = chatBox.scrollHeight;

    fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            question: question,
            scheme: scheme
        })
    })
    .then(res => res.json())
    .then(data => {
        // Remove typing indicator
        document.getElementById("typingIndicator").remove();
        
        // Add bot response
        const botMessage = `
            <div class="message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-label">AI Assistant</div>
                    ${formatResponse(data.answer)}
                </div>
            </div>
        `;
        chatBox.innerHTML += botMessage;
        chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
        // Remove typing indicator
        document.getElementById("typingIndicator").remove();
        
        // Add error message
        const errorMessage = `
            <div class="message bot">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-label">AI Assistant</div>
                    <i class="fas fa-exclamation-triangle"></i> Sorry, I couldn't process your request. Please make sure the server is running.
                </div>
            </div>
        `;
        chatBox.innerHTML += errorMessage;
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    questionInput.value = "";
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatResponse(text) {
    // Convert line breaks to proper HTML
    let formatted = escapeHtml(text);
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Make bullet points look better
    formatted = formatted.replace(/•/g, '<br>• ');
    
    // Make numbered lists look better
    formatted = formatted.replace(/(\d+\.)/g, '<br>$1');
    
    return formatted;
}
