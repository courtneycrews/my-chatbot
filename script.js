document.getElementById('send-button').addEventListener('click', sendMessage);

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const selectedGenre = document.getElementById('genre-select').value;
    
    if (userInput.trim() === '') return;

    appendMessage('user', userInput);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${API_KEY}'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {role: 'system', content: 'You are a creative writing assistant. Generate unique and inspiring writing prompts based on the user\'s input. The user may specify genres such as mystery, romance, sci-fi, or fantasy.' },
                {role: 'user', content: `Generate a ${selectedGenre} writing prompt based on: ${userInput}` }
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