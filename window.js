const os = require('os')
var chart = null;
var lastMeasureTimes = [];

function getCpuTimes(cpu) {
    return [
        cpu.times.user,
        cpu.times.sys,
        cpu.times.idle,
    ];
}

function setLastMeasureTimes(cpus) {
    var temp = [0, 0, 0]
    for (let i = 0; i < cpus.length; i++) {
        for (let j = 0; j < 3; j++) {
            temp[j] += getCpuTimes(cpus[i])[j];
        }
    }
    lastMeasureTimes = temp;
}

function getDatasets() {
    const datasets = []
    const cpus = os.cpus()
    const initData = {
        data: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
        ]
    }
    datasets.push(initData)
    testCpus = os.cpus();
    return datasets;
}

function updateDatasets() {
    const cpus = os.cpus()
    var currSum = [0, 0, 0]
    for (let i = 0; i < cpus.length; i++) {
        for (let j = 0; j < 3; j++) {
            currSum[j] += getCpuTimes(cpus[i])[j];
        }
    }
    var currUsage = [currSum[0]-lastMeasureTimes[0], currSum[1]-lastMeasureTimes[1], currSum[2]-lastMeasureTimes[2]]
    for (let i = 0; i < 60; i++) {
        chart.data.datasets[0].data[i] = chart.data.datasets[0].data[i+1]
    }
    chart.data.datasets[0].data[60] = 1.0 * (currUsage[0] + currUsage[1]) / (currUsage[0] + currUsage[1] + currUsage[2])
    chart.update();
    setLastMeasureTimes(cpus);
}

function drawChart() {
    chart = new Chart($('.chart'), {
        type: 'line',
        data: {
            labels: [
                '60 秒', '', '', '', '', '', '', '', '', '',
                '', '', '', '', '', '', '', '', '', '',
                '', '', '', '', '', '', '', '', '', '',
                '', '', '', '', '', '', '', '', '', '',
                '', '', '', '', '', '', '', '', '', '',
                '', '', '', '', '', '', '', '', '', '', '0'
            ],
            datasets: getDatasets()
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'CPU Utilization',
                fontColor: 'rgb(0, 0, 0)',
                fontSize: 16
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        max: 1
                    }
                }]
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            animation: {
                duration: 0
            }
        }
    });
    setInterval(updateDatasets, 1000);
}

$(() => {
    setLastMeasureTimes(os.cpus());
    drawChart();
})