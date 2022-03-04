//******************************************/
// Author       : Aldi Sugiarto
// Data         : March, 2nd 2022
// Filename     : sensor.js
//******************************************/

//**********Variable initialization**********//
const url = "json/sensor_data.json"

//**********Function to fetch data**********//
async function sensorGrouping() {
    try {
        await fetch(url)
            .then(sensors => {
                return sensors.json()
            }).then(calculateSensors);
    } catch (error) {
        console.log(error);
    }
};

//**********Calculate sensors**********//
function calculateSensors(sensors) {
    sensors = sensors.array
    var filterRoom = ["roomArea1", "roomArea2", "roomArea3"]
    var filterDate = []

    var date = new Date(sensors[0].timestamp)
    var newDate = ''
    // var newRoom = ""
    var newSensors = []
    var bDate = false
    var bRoom = false

    console.log("Button Start");
    console.log(startFlag);

    sensors.map(sensor => {
        date = new Date(sensor.timestamp)
        sensor.timestamp = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        newSensors.push(sensor);

        if (filterDate.length == 0) {
            filterDate.push(sensor.timestamp);
            console.log(newDate);
        }
        else {
            filterDate.map(d => {
                if (newDate == d) {
                    bDate = true
                }
            })
            if (bDate == false) {
                filterDate.push(sensor.timestamp);
                console.log(newDate);
            }
        }
        bDate = false
        newDate = sensor.timestamp
        // if (filterRoom.length == 0) {
        //     filterRoom.push(sensor.roomArea);
        //     console.log(newRoom);
        // }
        // else {

        //     filterRoom.map( d => {
        //         if (d === newRoom) {
        //             bRoom = true;
        //         }
        //     })
        //     console.log(newRoom);
        //     console.log(bRoom);
        //     if (bRoom == false) {
        //         filterRoom.push(sensor.roomArea);
        //         // console.log(newRoom);
        //     }
        // }
        // bRoom = false
        // newRoom = sensor.roomArea

    }) //map of sensors

    //***********Group sensors value based on room area and date***********//
    // Initialize value for new data and sensor
    var newData = []
    var dataSensor = {}
    // Initialize for index, temperature, and humidity
    var index = 0, temp = 0, hum = 0;
    // var minTemp, minHum, maxTemp, minHum, medTemp, medHum
    filterRoom.map(fRoom => {
        filterDate.map(fDate => {
            // Reset value for temperature and humidity
            temp = 0
            hum = 0
            // Grouping by date and room area
            var data = newSensors.filter(d => d.roomArea == fRoom & d.timestamp == fDate)
            // Calculate average sensor for temperature and humidity
            data.map(sensor => {
                temp += sensor.temperature
                hum += sensor.humidity
            })
            // Collect data sensor to object
            dataSensor = {
                "roomArea": fRoom,
                "date": fDate,
                "statSensors": {
                    "avgTemperature": temp / data.length,
                    "avgHumidity": hum / data.length,
                    "minTemp": min(data, "temp"),
                    "minHum": min(data, "hum"),
                    "maxTemp": max(data, "temp"),
                    "maxHum": max(data, "hum"),
                    "medTemp": med(data, "temp"),
                    "medHum": med(data, "hum"),
                }
            }
            // Push data to new new array data after grouping
            newData.push(dataSensor)
            // console.log(index);
            // console.log(data);
            // console.log(data.length);
            // console.log(temp/data.length);
            // console.log(hum/data.length);
            // index += 1
            // console.log(dataSensor.statSensors.minTemp);
            // console.log(dataSensor.statSensors.maxTemp);
            // console.log(dataSensor.statSensors.minHum);
            // console.log(dataSensor.statSensors.maxHum);
            // console.log(dataSensor.statSensors.medTemp);
            // console.log(dataSensor.statSensors.medHum);

        })

    })
    showSensor(newData);
    sensorChart(newData, filterRoom, filterDate);
    console.log(newData);

}

//**************Function to define minimum value**************//
function min(data, mode) {
    var minData = 0
    if (mode === "temp") {
        minData = data[0].temperature
        data.map(sens => {
            if (sens.temperature < minData) {
                minData = sens.temperature
            }
            else if (sens.temperature == minData) {
                minData = sens.temperature
            }
        })
    }
    else {
        minData = data[0].humidity
        data.map(sens => {
            if (sens.humidity < minData) {
                minData = sens.humidity
            }
            else if (sens.humidity == minData) {
                minData = sens.humidity
            }
        })
    }
    return minData
}

//**************Function to define maximum value**************//
function max(data, mode) {
    var maxData = 0
    if (mode === "temp") {
        maxData = data[0].temperature
        data.map(sens => {
            if (sens.temperature > maxData) {
                maxData = sens.temperature
            }
            else if (sens.temperature == maxData) {
                maxData = sens.temperature
            }
        })
    }
    else {
        maxData = data[0].humidity
        data.map(sens => {
            if (sens.humidity > maxData) {
                maxData = sens.humidity
            }
            else if (sens.humidity == maxData) {
                maxData = sens.humidity
            }
        })
    }
    return maxData
}

//**************Function to define median value**************//
function med(data, mode) {
    var medData = 0
    var arrData = []
    if (mode === "temp") {
        data.map(sen => {
            arrData.push(sen.temperature)
        })
        const mid = Math.floor(arrData.length / 2),
            nums = [...arrData].sort((a, b) => a - b);
        medData = arrData.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }
    else {
        data.map(sen => {
            arrData.push(sen.humidity)
        })
        const mid = Math.floor(arrData.length / 2),
            nums = [...arrData].sort((a, b) => a - b);
        medData = arrData.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
    }
    return medData
}

//**************Function to show chart**************//
function sensorChart(newData, fRoom, fDate) {
    let minT = [], maxT = [], medT = [], avgT = [];
    let minH = [], maxH = [], medH = [], avgH = [];
    let dataT = [], dataH = []

    fRoom.map(roomArea => {
        // Reset value of all array
        minT = []
        maxT = []
        medT = []
        avgT = []

        minH = []
        maxH = []
        medH = []
        avgH = []

        dataT = []
        dataH = []
        // Collecting data statistic array of temperature
        newData.map(d => {
            if (d.roomArea == roomArea) {
                minT.push(d.statSensors.minTemp)
                maxT.push(d.statSensors.maxTemp)
                medT.push(d.statSensors.medTemp)
                avgT.push(d.statSensors.avgTemperature)
            }
        })
        dataT.push(minT, maxT, medT, avgT)
        console.log(roomArea)
        console.log(dataT);

        // Collecting data statistic array of humidity
        newData.map(d => {
            if (d.roomArea == roomArea) {
                minH.push(d.statSensors.minHum)
                maxH.push(d.statSensors.maxHum)
                medH.push(d.statSensors.medHum)
                avgH.push(d.statSensors.avgHumidity)
            }
        })
        dataH.push(minH, maxH, medH, avgH)
        console.log(roomArea)
        console.log(dataH);
        if (roomArea == "roomArea1") {
            // document.getElementById("roomArea1").innerHTML = `<h2>Room Area 1</h2>`;
            plotChart('myChartT1', "Temperature", fDate, dataT, roomArea)
            plotChart('myChartH1', "Humidity", fDate, dataH, roomArea)
            textShow('statsT1',dataT)
            textShow('statsH1',dataH)
        }
        else if (roomArea == "roomArea2") {
            // document.getElementById("roomArea2").innerHTML = `<h2>Room Area 2</h2>`;
            plotChart('myChartT2', "Temperature", fDate, dataT, roomArea)
            plotChart('myChartH2', "Humidity", fDate, dataH, roomArea)
            textShow('statsT2',dataT)
            textShow('statsH2',dataH)
        }
        else {
            // document.getElementById("roomArea3").innerHTML = `<h2>Room Area 3</h2>`;
            plotChart('myChartT3', "Temperature", fDate, dataT, roomArea)
            plotChart('myChartH3', "Humidity", fDate, dataH, roomArea)
            textShow('statsT3',dataT)
            textShow('statsH3',dataH)
        }

    })
}

function plotChart(idHtml, titleChart, labels, datas, roomArea) {
    document.getElementById(roomArea).innerHTML = `<h2>${roomArea}</h2>`;
    const ctx = document.getElementById(idHtml).getContext('2d');

    const data = {
        labels: labels,
        datasets: []
    };

    // </block:setup>

    // <block:config:0>
    const config = {
        type: 'line',
        data: data,
        options: {
            radius: 5,
            hitRadius: 30,
            hoverRadius: 12,
            responsive: true,
            // animations: {
            //     tension: {
            //         duration: 1000,
            //         easing: 'easeInOutQuad',
            //         from: 1,
            //         to: 0,
            //         loop: true
            //     }
            // },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Timestamp'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: titleChart
                    },
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: titleChart
                }
            }
        }
    };

    const myChart = new Chart(ctx, config);
    datas.map((data, index) => {
        var label, color
        if (index == 0) {
            label = 'min'
            color = 'rgb(18, 37, 204)'
        }
        else if (index == 1) {
            label = 'max'
            color = 'rgb(222, 11, 11)'
        }
        else if (index == 2) {
            label = 'med'
            color = 'rgb(237, 149, 97)'
        }
        else {
            label = 'avg'
            color = 'rgb(97, 237, 99)'
        }
        const newDataset = {
            label: label,
            data: data,
            fill: true,
            borderColor: color,
            tension: 0.1
        }
        myChart.data.datasets.push(newDataset);
    })
    myChart.update()
    console.log(data.datasets);

}

function textShow(idHTML, datas) {
    // let dat = datas[0][datas.length-1]
    // console.log("Hello dude");
    // console.log(dat);
        let tab = `
        <label class="min">${datas[0][datas.length - 1].toFixed(2)}</label>
        <label class="max">${datas[1][datas.length - 1].toFixed(2)}</label>
        <label class="med">${datas[2][datas.length - 1].toFixed(2)}</label>
        <label class="avg">${datas[3][datas.length - 1].toFixed(2)}</label>
    `
    document.getElementById(idHTML).innerHTML = tab;
}

//**************Function to define innerHTML for HTML table**************//
function showSensor(data) {
    let tab =
        `<tr>
      <th>ID</th>
      <th>Room Area</th>
      <th>Date</th>
      <th>Average Temperature</th>
      <th>Average Humidity</th>
      <th>Min Temperature</th>
      <th>Max Temperature</th>
      <th>Min Humidity</th>
      <th>Max Humidity</th>
      <th>Median Temperature</th>
      <th>Median Humidity</th>
     </tr>`;

    data.map((sensor, index) => {
        tab += `<tr>
         <td class="align-center">${index + 1}</td>
         <td>${sensor.roomArea}</td>
         <td>${sensor.date}</td>
         <td class="align-center">${sensor.statSensors.avgTemperature.toFixed(2)}</td>
         <td class="align-center">${sensor.statSensors.avgHumidity.toFixed(2)}</td>
         <td class="align-center">${sensor.statSensors.minTemp.toFixed(2)}</td>
         <td class="align-center">${sensor.statSensors.maxTemp.toFixed(2)}</td>
         <td class="align-center">${sensor.statSensors.minHum.toFixed(2)}</td>
         <td class="align-center">${sensor.statSensors.maxHum.toFixed(2)}</td>
         <td class="align-center">${sensor.statSensors.medTemp.toFixed(2)}</td>
         <td class="align-center">${sensor.statSensors.medHum.toFixed(2)}</td>
         </tr>`;
    })

    // Setting innerHTML as tab variable
    document.getElementById("sensors").innerHTML = tab;
}
var startFlag = false
function handleStart(){    
    startFlag = !startFlag
    document.getElementById('startFlag').innerHTML = startFlag ? 'Started':'Stopped'
    document.getElementById('startLabel').innerHTML = startFlag ? 'Stop':'Start'

}
sensorGrouping();