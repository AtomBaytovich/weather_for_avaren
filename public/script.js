const ws = new WebSocket('ws://localhost:8080');

const chartData = {
    labels: [], // Временные метки
    temperature: [], // История температуры
    moisture: [], // История влажности
};

const ctx = document.getElementById('dataChart').getContext('2d');
const dataChart = new Chart(ctx, {
    type: 'line', 
    data: {
        labels: chartData.labels, 
        datasets: [
            {
                label: 'Температура (°C)',
                data: chartData.temperature,
                borderColor: '#f79b07',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Влажность (%)',
                data: chartData.moisture,
                borderColor: '#0313f783',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.3,
            },
        ],
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Время',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Значение',
                },
            },
        },
    },
});

ws.onopen = () => {
    console.log('ws готов');
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const currentTime = new Date().toLocaleTimeString();

    document.querySelector('.card.temperature .value').textContent = data.temperature;
    document.querySelector('.card.moisture .value').textContent = data.moisture;
    const statusElement = document.querySelector('.card.status .value');
    const statusIcon = document.querySelector('.card.status .icon');
    statusElement.textContent = data.status;
    statusIcon.src = data.status === 'Open' ? 'icons/open.svg' : 'icons/close.svg';
    chartData.labels.push(currentTime);
    chartData.temperature.push(parseFloat(data.temperature));
    chartData.moisture.push(parseFloat(data.moisture));

    if (chartData.labels.length > 10) {
        chartData.labels.shift();
        chartData.temperature.shift();
        chartData.moisture.shift();
    }
    dataChart.update();
};

ws.onerror = (error) => {
    console.error('Ошибка ws:', error);
};

ws.onclose = () => {
    console.log('ws закрт.');
};
