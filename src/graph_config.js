const data = {
  datasets: [
    {
      label: 'Colony power consumption (kWe)',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(192,35,35,0.4)',
      borderColor: 'rgba(192,25,25,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(225,25,25,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(255,25,25,1)',
      pointHoverBorderColor: 'rgba(255,25,25,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      yAxisID: 'A',
      data: []
    },
    {
      label: 'Colony battery charge (kWh)',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(25,25,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(25,25,225,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(25,25,255,1)',
      pointHoverBorderColor: 'rgba(25,25,255,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      yAxisID: 'B',
      data: []
    }/*,
    {
      label: 'Colony power demand (kWe)',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(192,192,20,0.4)',
      borderColor: 'rgba(192,192,20,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(25,25,225,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(200,200,25,1)',
      pointHoverBorderColor: 'rgba(200,200,25,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      yAxisID: 'A',
      data: []
    }*/
  ]
};

const options = {
  scales: {
    yAxes: [{
      id: 'A',
      type: 'linear',
      position: 'left',
      ticks: {
        max: 50,
        min: 0
      }
    }, {
      id: 'B',
      type: 'linear',
      position: 'right',
      ticks: {
        max: 200,
        min: 0
      }
    }]
  }
}

export {data, options}
