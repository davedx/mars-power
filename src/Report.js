import React from 'react'
import _ from 'lodash'
import {data, options} from './graph_config'
import {Chart, Line} from 'react-chartjs-2'

Chart.defaults.scale.ticks.autoSkipPadding = 20;

const Report = (props) => {
  data.labels = props.labels
  data.datasets[0].data = props.consumption
  data.datasets[1].data = props.generation
  data.datasets[2].data = props.batteryCharge

  data.datasets[0].hidden = props.disabled.consumption;
  data.datasets[1].hidden = props.disabled.generation;
  data.datasets[2].hidden = props.disabled.batteryCharge;

  if (props.consumption && props.consumption.length > 0) {
    const maxConsumption = _.max(props.consumption)
    const maxGeneration = _.max(props.generation)
    const maxKWe = Math.max(maxConsumption, maxGeneration)
    options.scales.yAxes[0].ticks.max = 10 + Math.ceil(maxKWe/10)*10
    options.scales.yAxes[1].ticks.max = Math.max(10, Math.ceil(_.max(props.batteryCharge)/10) * 10)
  }

  return <div className='report'>
    <div className='report-top'>
      <h3 className='float-left'>Report</h3>
      <div className='float-right graph-controls'>
        <label>
          <input type='checkbox' checked={props.disabled.consumption !== true} onClick={(e) => props.toggleGraphLine('consumption')} />
          Power consumption
        </label>
        <label>
          <input type='checkbox' checked={props.disabled.generation !== true} onClick={(e) => props.toggleGraphLine('generation')} />
          Power generation
        </label>
        <label>
          <input type='checkbox' checked={props.disabled.batteryCharge !== true} onClick={(e) => props.toggleGraphLine('batteryCharge')} />
          Battery charge
        </label>
      </div>
    </div>
    <Line data={data} options={options} />
  </div>
}

export default Report
