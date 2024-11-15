function createElement(type, style) {
    let element = document.createElement(type);
    element.classList.add(style);
    return element;
}

function createElementWithText(type, style, text) {
    let element = document.createElement(type);
    element.classList.add(style);
    element.textContent = text;
    return element;
}

let list_fights = [
    ['Результат', 'Рекорд', 'Соперник', 'Способ', 'Турнир', 'Дата', 'Раунд', 'Время'],
    ['Поражение', '22-6', 'Дастин Порье', 'ТКО', 'UFC 264: Poirier vs McGregor 3', '11.07.2021', '1', '5:00'],
    ['Поражение', '22-5', 'Дастин Порье', 'КО', '	UFC 257: Poirier vs McGregor 2', '23.01.2021', '2', '2:32'],
    ['Победа', '22-4', 'Дональд Серроне', 'ТКО', '	UFC 246: McGregor vs. Cowboy', '19.01.2020', '1', '0:40'],
    ['Поражение', '21-4', 'Хабиб Нурмагомедов', 'Болевой прием', 'UFC 229: Khabib vs. McGregor', '06.10.2018', '4', '3:03'],
    ['Победа', '21-3', 'Эдди Альварес', 'KO', 'UFC 205: Alvarez vs. McGregor', '12.11.2016', '2', '3:04'],
    ['Победа', '20-3', 'Нейт Диас', 'Решение большинства', 'UFC 202: Diaz vs. McGregor 2', '20.08.2016', '5', '5:00'],
    ['Поражение', '19-3', 'Нейт Диас', 'Удушающий приём', 'UFC 196: McGregor vs. Diaz', '05.03.2016', '2', '4:12'],
    ['Победа', '19-2', 'Жозе Алду', 'КО', 'UFC 194: Aldo vs. McGregor', '12.12.2015', '1', '0:13'],
    ['Победа', '18-2', 'Чен Мендес', 'ТКО', 'UFC 189: Mendes vs. McGregor', '18.01.2015', '2', '1:54'],
    ['Победа', '17-2', 'Деннис Зифер', 'ТКО', '	UFC Fight Night: McGregor vs. Siver', '18.01.2015', '2', '1:54'],
    ['Победа', '16-2', 'Дастин Порье', 'КО', 'UFC 178: Johnson vs. Cariaso', '27.09.2014', '1', '1:46'],
    ['Победа', '15-2', 'Диегу Брендан', 'ТКО', 'UFC Fight Night: McGregor vs. Brandao', '19.07.2014', '1', '4:05'],
    ['Победа', '14-2', 'Макс Холлоуэй', 'Единогласное решение', 'UFC Fight Night: Shogun vs. Sonnen', '17.08.2013', '3', '5:00'],
    ['Победа', '13-2', 'Маркус Бримейдж', 'ТКО', 'UFC on Fuel TV: Mousasi vs. Latifi', '06.04.2013', '1', '1:07'],
    ['Победа', '12-2', 'Иван Бухингер', 'КО', 'CWFC 51', '31.12.2012', '1', '3:40'],
    ['Победа', '11-2', 'Дэйв Хилл', 'Удушающий приём', 'CWFC 47', '02.06.2012', '2', '4:10'],
    ['Победа', '10-2', 'Стив О’Киф', 'КО', 'CWFC 45', '18.02.2012', '1', '1:33'],
    ['Победа', '9-2', ' Аарон Янсен', 'ТКО', 'CWFC: Fight Night 2', '08.09.2011', '1', '3:29'],
    ['Победа', '8-2', 'Артур Совинский', 'ТКО', 'Celtic Gladiator 2: Clash of the Giants', '11.06.2011', '2', '1:12'],
    ['Победа', '7-2', 'Патрик Доэрти', 'КО', 'Immortal Fighting Championship 4', '16.04.2011', '1', '0:04'],
    ['Победа', '6-2', 'Майк Вуд', 'КО', 'Cage Contender 8', '12.03.2011', '1', '0:16'],
    ['Победа', '5-2', 'Хью Брэди', 'ТКО', 'Chaos FC 8', '12.02.2011', '1', '2:31'],
    ['Поражение', '4-2', 'Джозеф Даффи', 'Удушающий приём', 'Cage Warriors 39: The Uprising', '27.11.2010', '1', '0:38'],
    ['Победа', '4-1', 'Коннор Диллон', 'ТКО', 'Chaos FC 7', '09.10.2010', '1', '4:22'],
    ['Победа', '3-1', 'Стивен Бейли', 'ТКО', 'K.O.: The Fight Before Christmas', '12.12.2008', '1', '1:22'],
    ['Поражение', '2-1', 'Артемий Ситенков', 'Болевой приём', 'Cage of Truth 3', '28.06.2008', '1', '1:09'],
    ['Победа', '2-0', 'Мо Тейлор', 'ТКО', 'Cage Rage Contenders — Ireland vs. Belgium', '03.05.2008', '1', '1:06'],
    ['Победа', '1-0', 'Гэри Моррис', 'TKO', 'Cage of Truth 2', '08.03.2008', '2', 'н/д']
]

let result = [
    ['Боев - 28', 'Побед - 22', 'Поражений - 6'],
    ['Нокаутом', '19', '2'],
    ['Сдачей', '1', '4'],
    ['Решением', '2', '0']
]

let body = document.body;
let main = createElement('div', 'main');
let mainSection = createElement('section', 'main-section');
body.appendChild(main);
main.appendChild(mainSection);
let mainDiv = createElement('div', 'main-div');
mainSection.appendChild(mainDiv);
let tableTitle = createElementWithText('h1', 'main-h1', 'КАРЬЕРА В MMA');
mainDiv.appendChild(tableTitle);
let table = createElement('table', 'table');
mainDiv.classList.add('table-div');
let tableResult = createElement('table', 'table');
mainDiv.appendChild(tableResult);
for (let i = 0; i < result.length; i++) {
    let row = createElement('tr', 'row');
    tableResult.appendChild(row);
    for (let j = 0; j < result[i].length; j++) {
        let elem = createElementWithText('td', 'elem', result[i][j]);
        if (i != 0 && j == 1) {
            elem.classList.add('green');
        }
        if (i != 0 && j == 2) {
            elem.classList.add('red');
        }
        row.appendChild(elem);
    }
    tableResult.appendChild(row);
}
let resultTitle = createElementWithText('h1', 'main-h1', 'БОИ');
mainDiv.appendChild(resultTitle);
mainDiv.appendChild(table);
for (let i = 0; i < list_fights.length; i++) {
    let row = createElement('tr', 'row');
    table.appendChild(row);
    for (let j = 0; j < list_fights[i].length; j++) {
        let elem = createElementWithText('td', 'elem', list_fights[i][j]);
        if (i == 0) {
            elem.classList.add('first');
        }
        if (j == 0) {
            if (elem.textContent == 'Победа') {
                elem.classList.add('green');
            }
            if (elem.textContent == 'Поражение') {
                elem.classList.add('red');
            }
        }
        row.appendChild(elem);
    }
    table.appendChild(row);
}




