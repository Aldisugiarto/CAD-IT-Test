//******************************************/
// Author       : Aldi Sugiarto
// Data         : March, 2nd 2022
// Filename     : sensorChart.js
//******************************************/

const ctx = document.getElementById('myChart').getContext('2d');

const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
        label: 'Temperature',
        data: [65, 59, 80, 81, 26, 55, 40],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        // tension: 0.1
    },
    {
        label: 'Temperature',
        data: [6, 5, 8, 8, 2, 5, 4],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        // tension: 0.1
    },]
};
// </block:setup>

// <block:config:0>
const config = {
    type: 'line',
    data: data,
    options: {
        radius:5,
        hitRadius: 30,
        hoverRadius: 12,
        // responsive: true,
        animations: {
            tension: {
              duration: 1000,
              easing: 'easeInOutQuad',
              from: 1,
              to: 0,
              loop: true
            }
          },
        scales: {
            y: { // defining min and max so hiding the dataset does not change scale range
                min: 0,
                max: 100
            }
        },
        // plugins:{
        //     legend:{
        //         position: top
        //     }
        // }
    }
};

const myChart = new Chart(ctx, config)
myChart.data.datasets.pop();
myChart.update()