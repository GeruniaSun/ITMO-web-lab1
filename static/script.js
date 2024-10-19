const canvas = document.getElementById('grid');
const ctx = canvas.getContext('2d');


// приколы
const gachiSound = new Audio('sounds/h.mp3');
const gavrillinaSound = new Audio('sounds/Drama_Queen.mp3');
const easterEgg = document.getElementById('cringe_area');

const form = document.getElementById('form');
const xButtons = document.getElementsByName('x');
const yInput = document.getElementById('y');
const yErrorLabel = document.getElementById('y_error_label');
const rCheckboxes = document.getElementsByName('r');
const submit = document.getElementById('submit_button');
let dots = [];

// рисуем сетку
const gridSpacing = 20;
const originX = canvas.width / 2;
const originY = canvas.height / 2;
const scale = 100;

// табличка
const rowsPerPage = 10;
const attempts = [];

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    ctx.strokeStyle = 'orange';
    ctx.fillStyle = 'orange';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, canvas.height);
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0)
    ctx.lineTo(canvas.width/2 - 15, 20);
    ctx.lineTo(canvas.width/2 + 15, 20);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvas.width, canvas.height/2)
    ctx.lineTo(canvas.width - 20, canvas.height/2 - 15);
    ctx.lineTo(canvas.width - 20, canvas.height/2 + 15);
    ctx.closePath();
    ctx.fill();
}

function drawPoint(x, y) {
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.arc(originX + x * scale, originY - y * scale, 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
}

function drawArea(r) {
    ctx.fillStyle = 'rgba(255, 165, 0, 0.5)';

    ctx.beginPath();

    // 1-ая четверть
    ctx.moveTo(originX + r * scale, originY);
    ctx.lineTo(originX + r * scale, originY - r/2 * scale);
    ctx.lineTo(originX, originY - r/2 * scale);

    //2-ая четверть
    ctx.lineTo(originX - r/2 * scale, originY)

    // 3-ья четверть
    ctx.moveTo(originX, originY);
    ctx.arc(originX, originY, r/2 * scale, 0.5 * Math.PI,  Math.PI);

    ctx.fill();
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

drawGrid();

// превращение кнопок X в радиокнопки
function setActiveButton(button) {
    xButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    button.classList.add('active');
}

xButtons.forEach(button => {
    button.addEventListener('click', () => setActiveButton(button));
});

// проверка Y
function validateY() {
    yInput.value = yInput.value.replace(',', '.');
    if (yInput.value.trim() == "" || isNaN(yInput.value)) {
        return false;
    }
    const y = parseFloat(yInput.value);
    if (!isNaN(y) && -3 <= y  && y <= 3 &&
     -3 <= Number(yInput.value.replace(/0/g, '')) && Number(yInput.value.replace(/0/g, '') <= 3)) {
        return true;
     }
}

// прикол
function showEasterEgg(status) {
    easterEgg.style.display = status ? "block" : "none";
    if (status) {
        gavrillinaSound.play().catch(error => {
                    console.error("Ошибка при воспроизведении звука:", error);
                });
    }
    else {
        gavrillinaSound.pause();
        gavrillinaSound.currentTime = 0;
    }
}

// превращение чекбоксов R в радиокнопки
function validateOnlyOne(checkbox) {
    rCheckboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
    });
}

rCheckboxes.forEach(function (checkbox) {
    checkbox.addEventListener("click", function () {
        validateOnlyOne(checkbox);
    });
});

function confirmSubmit() {
    const xSelected = Array.from(xButtons).some(button => button.classList.contains('active'));
    const yFilled = validateY();
    const rSelected = Array.from(rCheckboxes).some(input => input.checked);

    yErrorLabel.style.display = validateY() ? "none" : "inline";

    showEasterEgg(yInput.value === "mashusikthebest");

    submit_button.disabled = (xSelected && yFilled && rSelected) ? false : true;
}

rCheckboxes.forEach(input => input.addEventListener("change", confirmSubmit));
yInput.addEventListener("input", confirmSubmit);
rCheckboxes.forEach(input => input.addEventListener("change", confirmSubmit));

let currentPage = 1;
showPage(currentPage);
setupPagination();

// получаем форму
form?.addEventListener('submit', function(event){
    event.preventDefault();

    const xValue = parseInt(Array.from(xButtons).find(button =>
        button.classList.contains('active')).value);
    const yValue = parseFloat(yInput.value)
    const rValue = parseInt(Array.from(rCheckboxes).find(checkbox => checkbox.checked).value);

    console.log('X:', xValue);
    console.log('Y:', yValue);
    console.log('R:', rValue);
    gachiSound.play().catch(error => {
                    console.error("Ошибка при воспроизведении звука:", error);
                });
// http://localhost:20013/fcgi-bin/WebLab1.jar
//http://localhost:24113/fcgi-bin/WebLab1.jar

    fetch('/api/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                x: xValue,
                y: yValue,
                r: rValue
        }),
    }).then(response => {
          if (!response.ok) {
              throw new Error('Ошибка сети: ' + response.status);
          }
          return response.json();
    })
    .then(data => {
        console.log(data);
        appendData(data);
        showPage(currentPage);
        setupPagination();

        // рисовашки
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawArea(rValue);
        dots.push([xValue, yValue]);
        dots.forEach(dot => drawPoint(dot[0], dot[1]));
    })
    .catch(error => {
        alert('Ошибка отправки данных.\n' + error.message + error.stack);
        console.log(error.stack);
    });
});

function appendData(data) {
    attempts.unshift({
        x: data.x,
        y: data.y,
        r: data.r,
        hit: data.hit,
        currTime: data.currTime,
        execTime: parseFloat(data.execTime).toFixed(4) + " сек.",
    })

    console.log(attempts);
}

function showPage(page) {
const tableBody = document.getElementById('tbody');
    tableBody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, attempts.length);

    for (let i = start; i < end; i++) {
        const row = `<tr>
                        <td>${attempts[i].x}</td>
                        <td>${attempts[i].y}</td>
                        <td>${attempts[i].r}</td>
                        <td>${attempts[i].hit}</td>
                        <td>${attempts[i].currTime}</td>
                        <td>${attempts[i].execTime}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    }
}

function setupPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    console.log("+1 penis");
    const pageCount = Math.ceil(attempts.length / rowsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('page-button');
        button.addEventListener('click', () => {
            currentPage = i;
            showPage(currentPage);
            setupPagination();
        });
        if (i === currentPage) {
            button.disabled = true;
        }
        if (Math.abs(i - currentPage) > 5 && i !== pageCount) {
            button.hidden = true;
        }
        pagination.appendChild(button);
    }


}
