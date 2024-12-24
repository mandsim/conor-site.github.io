let isDrawing = false;
let startX = 0;
let startY = 0;
let lastX = 0;
let lastY = 0;
let cuts = [];
let shapeDrawn = false;
let startPolygon = [];
let polygons = [];
let bigArea = 0;
let squares = []
let sides = 0;
let currentLevel = 0;
let target = 0;
let scores = [0, 0, 0];
let score = 0;
let timerInterval;
let timeMain = 0;
let timeLeft = 0;
let currentStage = 1;
let maxStages = 3;
let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');

function goToPlayersPage() {
    window.location.href = 'rating.html';
}

document.getElementById('backToMain').addEventListener('click', () => {
    window.location.href = 'index.html';
});

function initGame() {
    let playerName = localStorage.getItem('playerName');

    if (!playerName) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('player').textContent = `Игрок: ${playerName}`;
    document.getElementById('player-level').textContent = `Игрок: ${playerName}`;
    let playerData = JSON.parse(localStorage.getItem('playerData')) || {};
    if (playerData[playerName]) {
        scores = playerData[playerName].scores || [0, 0, 0];
    } else {
        scores = [0, 0, 0];
    }

    document.getElementById('score-menu').textContent = "Счет: " + sumLevelScores();
}

function startLevel(level) {
    currentLevel = level;
    hideMenu();
    switch (level) {
        case 1:
            score = 0;
            currentStage = 1;
            updateScore();
            setParams(2, 3, 20)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру на 2 равные части.";
            loadLevel();
            break;
        case 2:
            setParams(2, 4, 30)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру на 2 равные части.";
            loadLevel();
            break;
        case 3:
            setParams(2, 5, 40)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру на 2 равные части.";
            loadLevel();
            break;
        case 4:
            score = 0;
            currentStage = 4;
            updateScore();
            setParams(2, 3, 30)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру так, чтобы получилось 2 треугольника.";
            loadLevel();
            break;
        case 5:
            setParams(3, 4, 40)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру так, чтобы получилось 3 треугольника.";
            loadLevel();
            break;
        case 6:
            setParams(4, 5, 45)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру так, чтобы получилось 4 треугольника.";
            loadLevel();
            break;
        case 7:
            score = 0;
            currentStage = 7;
            updateScore();
            setParams(10, 5, 40)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру на 10 частей";
            loadLevel();
            break;
        case 8:
            setParams(20, 5, 45)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру на 20 частей";
            loadLevel();
            break;
        case 9:
            setParams(40, 5, 50)
            document.getElementById('goal').textContent = "Цель: Разрежьте фигуру на 40 частей";
            loadLevel();
            break;
        default:
            break;
    }
}

function nextStage() {
    currentStage++;
    document.getElementById('stageMenu').classList.remove('show-stage');
    document.getElementById('stageMenu').classList.add('hidden');
    cuts = [];
    polygons = [];
    startLevel(currentStage)  
}

function sumLevelScores() {
    let sum = 0;
    for (let i = 0; i < scores.length; i++) {
        sum += scores[i];
    }
    return sum;
}


function completeStage() {
    stopTimer();
    if (currentStage % 3) {
        // Показать меню "Стадия завершена"
        document.getElementById('stageMenu').classList.remove('hidden');
        document.getElementById('stageMenu').classList.add('show-stage');
    } else {
        prevLevelScore = score;
        let winMenu = document.getElementById('winMenu');
        winMenu.classList.remove('hidden');
        winMenu.classList.add('show-win')
    }
}

function checkLevelCompletion(polygons) {
    switch (currentLevel) {
        case 1: case 2: case 3:
            let areas = polygons.map(getPolygonArea);
            if (areas.every(area => Math.abs(area - areas[0]) < bigArea / target * 0.1) && areas.length == target) {
                addPoints(100);
                completeStage();
            }
            break;
        case 4: case 5: case 6:
            let nPolygons = polygons.filter(poly => poly.length == 3).length;
            if (nPolygons >= target) {
                addPoints(100);
                completeStage();
            }
            break;
        case 7: case 8: case 9:
            if (polygons.length >= target) {
                addPoints(100);
                completeStage();
            }
            break;
        default:
            break;
    }
}

function setParams(_target, _sides, _time) {
    target = _target;
    sides = _sides;
    timeMain = _time;
}

function hideMenu() {
    document.getElementById('menu').classList.remove('menu');
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('game').classList.add('show-game');
}

function hideEndTimeMenu() {
    document.getElementById('endTimeMenu').classList.add('hidden');
    document.getElementById('endTimeMenu').classList.remove('show-time');
}

function hideWinMenu() {
    winMenu.classList.add('hidden');
    winMenu.classList.remove('show-win');
}

function showWinMenu() {
    let winMenu = document.getElementById('winMenu');
    winMenu.classList.remove('hidden');
    winMenu.classList.add('show-win');
}

function showEndTimeMenu() {
    document.getElementById('endTimeMenu').classList.remove('hidden');
    document.getElementById('endTimeMenu').classList.add('show-time');
}

function showMenu() {
    document.getElementById('menu').classList.add('menu');
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('game').classList.remove('show-game');
    document.getElementById('game').classList.add('hidden');
}

function backToMenu() {
    if (currentStage % 3 != 0) {
        score = 0;
    }
    else {
        let maxScore = Math.max(scores[Math.floor(currentStage / maxStages) - 1], score)
        scores[Math.floor(currentStage / maxStages) - 1] = maxScore;
        document.getElementById('record').textContent = `Рекорд: ${maxScore}`
    }
    let playerName = localStorage.getItem('playerName');
    if (playerName) {
        let playerData = JSON.parse(localStorage.getItem('playerData')) || {};
        playerData[playerName] = { scores };
        localStorage.setItem('playerData', JSON.stringify(playerData));
    }
    stopTimer();
    document.getElementById('score-menu').textContent = `Счет: ${sumLevelScores()}`
    hideWinMenu();
    hideEndTimeMenu();
    showMenu();
}

function restartLevel() {
    if (score - 5 >= 0) {
        score = score - 5;
    }
    cuts = [];
    polygons = [];
    updateScore()
    polygons.push(startPolygon)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShape(polygons)
}

function restartLevelTimeOver() {
    if (score - 20 >= 0) {
        score = score - 20;
    }
    updateScore();
    hideEndTimeMenu();
    polygons.push(startPolygon)
    loadLevel();
}

function updateScore() {
    document.getElementById('score').textContent = `Очки: ${score}`;
    document.getElementById('record').textContent = `Рекорд: ${scores[Math.floor(currentStage / maxStages)]}`
}

function addPoints(points) {
    score += points;
    updateScore();
}

function resetScore() {
    score = 0;
    updateScore();
}

function updateTimer() {
    document.getElementById('timer').textContent = `Время: ${timeLeft}`;
}

function startTimer() {
    timeLeft = timeMain
    updateTimer();
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Время: ${timeLeft}`;
        if (timeLeft <= 0) {
            stopTimer();
            onTimeOut();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
}

function stopTimer() {
    clearInterval(timerInterval);
}

function onTimeOut() {
    showEndTimeMenu();
}

function getIntersection(p1, p2, p3, p4) {
    let x1 = p1.x, y1 = p1.y;
    let x2 = p2.x, y2 = p2.y;
    let x3 = p3.x, y3 = p3.y;
    let x4 = p4.x, y4 = p4.y;
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
		return false;
	}
	let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
	if (denominator === 0) {
		return false;
	}
	let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
	let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;
	if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
		return false;
	}
	let x = x1 + ua * (x2 - x1);
	let y = y1 + ua * (y2 - y1);
	return {x, y};
}

function findIntersections(cut, shapeVertices) {
    let intersections = [];
    let cutStart = {x: cut.startX, y: cut.startY};
    let cutEnd = {x: cut.endX, y: cut.endY};
    for (let i = 0; i < shapeVertices.length; i++) {
        let vertex1 = {x: shapeVertices[i].x, y: shapeVertices[i].y};
        let vertex2 = {x: shapeVertices[(i + 1) % shapeVertices.length].x, y: shapeVertices[(i + 1) % shapeVertices.length].y};
        let intersection = getIntersection(cutStart, cutEnd, vertex1, vertex2);
        if (intersection) {
            intersections.push({
                intersection,
                sideStart: i,
                sideEnd: (i + 1) % shapeVertices.length
            });
        }
    }
    return intersections;
}

function drawRandomShape(sides, centerX = 150, centerY = 150, maxRadius = 120) {
    let angleStep = (2 * Math.PI) / sides;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.translate(-centerX, -centerY);
    let shapeVertices = []
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        let radius = Math.random() * (maxRadius - 50) + 50;
        let x = centerX + radius * Math.cos(i * angleStep);
        let y = centerY + radius * Math.sin(i * angleStep);
        let vertex = {x: x, y: y};

        shapeVertices.push(vertex);
        if (i === 0) {
            ctx.moveTo(vertex.x, vertex.y);
        } else {
            ctx.lineTo(vertex.x, vertex.y);
        }
    }
    startPolygon = shapeVertices
    polygons.push(shapeVertices)
    bigArea = getPolygonArea(polygons[0])
    ctx.closePath();
    ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    return shapeVertices;
}

function drawLine(start, end, color = 'black') {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
}

function enableCutting(canvas, ctx) {
    canvas.addEventListener('mousedown', (e) => {
        savedCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height);
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            ctx.putImageData(savedCanvas, 0, 0);
            let currentX = e.offsetX;
            let currentY = e.offsetY;
            drawLine({ x: startX, y: startY }, { x: currentX, y: currentY }, 'red');
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (!isDrawing) return;
        isDrawing = false;
        let endX = e.offsetX;
        let endY = e.offsetY;
        ctx.putImageData(savedCanvas, 0, 0);
        drawLine({ x: startX, y: startY }, { x: endX, y: endY });
        cuts.push({ startX, startY, endX, endY });
        let oldLength = polygons.length;
        polygons = separatePolygon(polygons)
        let newLength = polygons.length;
        if (newLength > oldLength) {
            drawShape(polygons)
            checkLevelCompletion(polygons);
        }
    });
}

function separatePolygon(polygons) {
    let newPolygons = [];
    squares.length = 0;
    let count = 0;
    polygons.forEach(polygon => {
        let intersections = findIntersections(cuts[cuts.length - 1], polygon);
        if (intersections.length == 2) {
            let firstPolygon = [];
            let secondPolygon = [];
            var startPoint = intersections[intersections.length - 2];
            var endPoint = intersections[intersections.length - 1];
            firstPolygon.push({x: startPoint.intersection.x, y : startPoint.intersection.y})
            var i = startPoint.sideStart % polygon.length;
            var j = startPoint.sideEnd % polygon.length + polygon.length;
            if (polygon[startPoint.sideEnd] == polygon[i+1]) {
                i = startPoint.sideEnd % polygon.length;
                j = startPoint.sideStart % polygon.length + polygon.length;
            }
            firstPolygon.push(polygon[i]);
            while (i != endPoint.sideEnd && i != endPoint.sideStart) {
                i++;
                firstPolygon.push(polygon[i]);
            }
            firstPolygon.push({x: endPoint.intersection.x, y : endPoint.intersection.y})
            secondPolygon.push({x: endPoint.intersection.x, y : endPoint.intersection.y})
            for (let k = i + 1; k < j + 1; k++) {
                secondPolygon.push(polygon[k % polygon.length])
            }
            secondPolygon.push({x: startPoint.intersection.x, y : startPoint.intersection.y})
            newPolygons.push(firstPolygon)
            newPolygons.push(secondPolygon)
            count++
            squares.push(getPolygonArea(firstPolygon))
            squares.push(getPolygonArea(secondPolygon))
        }
        else {
            newPolygons.push(polygon)
            squares.push(getPolygonArea(polygon))
        }
    });
    if (count == 0) {
        cuts.pop();
    }
    return newPolygons;
}

function drawShape(polygons) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    polygons.forEach(vertices => {
        ctx.beginPath();
        vertices.forEach((vertex, index) => {
            if (index === 0) {
                ctx.moveTo(vertex.x, vertex.y);
            } else {
                ctx.lineTo(vertex.x, vertex.y);
            }
        });
        ctx.closePath();
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 60%)`;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    });
}

function getPolygonArea(polygon) {
    let area = 0;
    for (let i = 0; i < polygon.length; i++) {
        let j = (i + 1) % polygon.length;
        area += polygon[i].x * polygon[j].y - polygon[j].x * polygon[i].y;
    }
    return Math.abs(area / 2);
}

function loadLevel() {
    if (currentStage % 3 != 0) {
        document.getElementById('level').textContent = 'Уровень ' + (Math.floor(currentStage / maxStages) + 1) + '.' + (currentStage % maxStages);
    }
    else {
        document.getElementById('level').textContent = 'Уровень ' + (Math.floor(currentStage / maxStages)) + '.' + 3;
    }
    cuts = [];
    polygons = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetTimer();
    drawRandomShape(sides);
    shapeDrawn = true;
    enableCutting(canvas, ctx);
}

document.addEventListener('DOMContentLoaded', initGame);