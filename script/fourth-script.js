let associativeArray = {};
let offsetX, offsetY;
let dragSource = null;
let originalElement = null;
let staticElem = null;
let inputField = document.getElementById("inputString");
let splitButton = document.getElementById("button");
splitButton.disabled = true;

inputField.addEventListener("input", () => {
    if (inputField.value.trim() !== "") {
        splitButton.disabled = false;
    } else {
        splitButton.disabled = true;
    }
});

function parseAndDisplay() {
    let input = document.getElementById("inputString").value;
    let items = input.split(" - ").map(item => item.trim());
    let wordsLower = [];
    let wordsUpper = [];
    let numbers = [];
    items.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (item[0] == item[0].toUpperCase()) {
            wordsUpper.push(item);
        } else {
            wordsLower.push(item);
        }
    });
    wordsLower.sort();
    wordsUpper.sort();
    numbers.sort((a, b) => a - b);
    associativeArray = {};
    let index = 1;
    wordsLower.forEach(word => {
        associativeArray[`a${index++}`] = word;
    });
    index = 1;
    wordsUpper.forEach(word => {
        associativeArray[`b${index++}`] = word;
    });
    index = 1;
    numbers.forEach(num => {
        associativeArray[`n${index++}`] = num;
    });
    let deleteContainer = document.querySelectorAll('.display-block');
    let deleteClicked = document.querySelector('.clicked-items-container');
    deleteContainer.forEach(element => {
        element.innerHTML = '';
    });
    deleteClicked.innerHTML = '';
    displayItems(associativeArray);
}

function displayItems(associativeArray) {
    let block2 = document.getElementById("block2");
    block2.innerHTML = "";
    for (let key in associativeArray) {
        let item = document.createElement("div");
        item.className = "draggable";
        item.draggable = true;
        item.textContent = key + " - " + associativeArray[key];
        item.dataset.key = key;
        item.style.backgroundColor = getRandomColor();
        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragend", dragEnd);
        block2.appendChild(item);
    }
}

function getRandomColor() {
    let letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function addItemToClickedContainer(item) {
    let container = document.getElementById("clickedItemsContainer");
    container.textContent = container.textContent + associativeArray[item.dataset.key] + " ";
}

function dragStart(event) {
    let key = event.target.dataset.key;
    dragSource = event.target.parentNode;
    originalElement = event.target;
    event.dataTransfer.setData("key", key);
    event.dataTransfer.setData("text", event.target.textContent);
    let rect = event.target.getBoundingClientRect();
    offsetX = event.clientX - rect.left;
    offsetY = event.clientY - rect.top;
}

function dragEnd() {
    dragSource = null;
    originalElement = null;
}

function changeCoord(event, newItem) {
    let itemWidth = newItem.offsetWidth;
    let itemHeight = newItem.offsetHeight;
    let rect = event.currentTarget.getBoundingClientRect();
    let newX = event.clientX - rect.left - offsetX;
    let newY = event.clientY - rect.top - offsetY;
    let padding = 5;
    let maxX = rect.width - itemWidth - padding;
    let maxY = rect.height - itemHeight - padding;
    if (newX < padding) newX = padding;
    if (newY < padding) newY = padding;
    if (newX > maxX) newX = maxX;
    if (newY > maxY) newY = maxY;
    newItem.style.left = `${newX}px`;
    newItem.style.top = `${newY}px`;
}

document.getElementById("block1").addEventListener("dragover", (event) => {
    event.preventDefault();
});

document.getElementById("block1").addEventListener("drop", (event) => {
    event.preventDefault();
    let key = event.dataTransfer.getData("key");
    let existingItem = block1.querySelector(`.draggable-inside-block1[data-key='${key}']`);
    if (existingItem) {
        changeCoord(event, existingItem);
    }
    else {
        let text = event.dataTransfer.getData("text");
        let newItem = document.createElement("div");
        newItem.className = "draggable-inside-block1";
        newItem.dataset.key = key;
        newItem.textContent = text;
        document.getElementById("block1").appendChild(newItem);
        changeCoord(event, newItem);
        newItem.draggable = true;
        newItem.addEventListener("dragstart", dragStart);
        newItem.addEventListener("dragend", dragEnd);
        newItem.addEventListener("dragover", handleDragOver);
        newItem.addEventListener("drop", handleDrop);
        newItem.onclick = () => addItemToClickedContainer(newItem);
        if (dragSource.id == 'block1') {
            originalElement.remove();
        }
        if (dragSource.id == 'block2') {
            let originalItem = [...document.getElementById("block2").children].find(child => child.dataset.key == key);
            if (originalItem) {
                originalItem.classList.add('hide');
            }
        }
    }
});

document.getElementById("block2").addEventListener("dragover", (event) => {
    event.preventDefault();
});

document.getElementById("block2").addEventListener("drop", (event) => {
    if (event.target === block2) {
        // Отменяем перетаскивание, если кликнули по пустому пространству
        event.preventDefault();
    }
    let key = event.dataTransfer.getData("key");
    let parent = document.getElementById('block2');
    parent.childNodes.forEach(element => {
        if (element.dataset.key == key) {
            element.classList.remove('hide');
        }
    });
    if (dragSource.id == 'block1') {
        originalElement.remove();
    }
});

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const draggedKey = event.dataTransfer.getData("key");
    const draggedText = event.dataTransfer.getData("text");
    const targetItem = event.target;
    if (targetItem.classList.contains("draggable-inside-block1")) {
        const targetKey = targetItem.dataset.key;
        const targetText = targetItem.textContent;
        targetItem.dataset.key = draggedKey;
        targetItem.textContent = draggedText;
        const draggedItem = document.querySelector(`.draggable-inside-block1[data-key="${draggedKey}"]`);
        if (draggedItem) {
            draggedItem.dataset.key = targetKey;
            draggedItem.textContent = targetText;
            console.log(originalElement);
            draggedItem.style.left = originalElement.style.left;
            draggedItem.style.top = originalElement.style.top;
        }
    }
}

function setEqualWidth() {
    let elements = document.querySelectorAll(".draggable");
    let maxWidth = 0;
    elements.forEach(element => {
        let elementWidth = element.offsetWidth;
        if (elementWidth > maxWidth) {
            maxWidth = elementWidth;
        }
    });
    elements.forEach(element => {
        element.style.width = `${(maxWidth)}px`;
    });
}