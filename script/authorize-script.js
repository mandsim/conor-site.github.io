document.getElementById('startGame').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value;
    if (playerName.trim()) {
        localStorage.setItem('playerName', playerName);
        window.location.href = 'game.html';
    } else {
        
    }
});

document.getElementById('backToMain').addEventListener('click', () => {
    window.location.href = 'index.html';
});