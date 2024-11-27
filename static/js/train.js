window.onload = function() {
    const keys = Object.keys(sessionStorage);
    let storedText = '';

    for (let key of keys) {
        storedText += `${key}: ${sessionStorage.getItem(key)}\n`;
    }

    if (storedText) {
        document.getElementById('trainingScript').value = storedText;
    }
};

fetch('/train/generate', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ script: trainingScript, type: 'sop' })
})

.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    if (data.error) {
        console.error('Error generating training script:', data.error);
        alert('Error generating training script: ' + data.error);
    } else {
        document.getElementById('assistantScript').value = data.text;
        alert('Training script generated successfully!');
    }
})
.catch(error => {
    console.error('Error:', error);
    alert('Error generating training script: ' + error.message);
});

function assignAssistant() {
    // Implement the logic for assigning an assistant
    alert('Assign Assistant function is not implemented yet.');
}

function assignVocal() {
    const assistantScript = document.getElementById('assistantScript').value;
    const maxLength = 2000;

    if (assistantScript.trim() !== '') {
        let truncatedScript = assistantScript.trim();
        if (truncatedScript.length > maxLength) {
            truncatedScript = truncatedScript.substring(0, maxLength) + '...';
        }

        const utterance = new SpeechSynthesisUtterance(truncatedScript);

        function selectFemaleVoice() {
            const voices = speechSynthesis.getVoices();
            for (let voice of voices) {
                if (voice.name.includes('Female') || voice.gender === 'female') {
                    return voice;
                }
            }
            return voices.find(voice => voice.lang.includes('en')) || voices[0];
        }

        utterance.voice = selectFemaleVoice();

        const video = document.getElementById('cornerVideo');

        utterance.onstart = () => {
            console.log('Speech has started');
            video.style.display = 'block';
            video.play();
        };

        utterance.onend = () => {
            console.log('Speech has ended');
            video.pause();
            video.style.display = 'none';
        };

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event.error);
        };

        speechSynthesis.speak(utterance);
        alert('Assistant assigned and script vocalized!');
    } else {
        alert('Please enter some text in the assistant tasks area.');
    }
}

function assignVisual() {
    const videoContainer = document.getElementById('videoContainer');
    const youtubeVideo = document.getElementById('youtubeVideo');
    youtubeVideo.src = "https://www.youtube.com/embed/C55EbHLvv-w";  // Replace with your actual video ID
    videoContainer.style.display = 'block';
}

window.speechSynthesis.onvoiceschanged = function() {
    const vocalButton = document.getElementById('vocalButton');
    vocalButton.onclick = assignVocal;
};
