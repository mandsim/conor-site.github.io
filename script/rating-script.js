function loadPlayers() {
    const playerData = JSON.parse(localStorage.getItem('playerData')) || {};
    const tableBody = document.getElementById('playersTable').querySelector('tbody');
    const players = Object.entries(playerData).map(([name, data]) => ({
        name,
        score: data.scores.reduce((sum, points) => sum + points, 0)
    }));
    players.sort((a, b) => b.score - a.score);
    tableBody.innerHTML = '';
    players.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        tableBody.appendChild(row);
    });
}

function backToMenu() {
    window.location.href = 'game.html';
}

document.addEventListener('DOMContentLoaded', loadPlayers);