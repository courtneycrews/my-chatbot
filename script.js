require('dotenv').config();
const API_KEY = process.env.API_KEY;

document.getElementById('send-button').addEventListener('click', sendMessage);

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    appendMessage('user', userInput);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer API_KEY'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {role: 'system', content: 'You are a snarky but helpful assistant.' },
                {role: 'user', content: userInput }
            ],
            max_tokens: 150
        }) 
    });

    if (response.ok) {
        const data = await response.json();
        const botReply = data.choices[0].message.content.trim();
        appendMessage('bot', botReply);
    } else {
        appendMessage('bot', 'Error: Unable to fetch response from the server.');
    }

    document.getElementById('user-input').value = '';

}

function appendMessage(sender, message) {

    const chatBox = document.getElementById('chat-box');
    if (!chatBox) {
        console.error('Chat box element not found!');
        return;
    }
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}