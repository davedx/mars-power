import React from 'react'

const Results = props =>
<div>
  <h4>Results</h4>
  {props.methaneTons > 0 && <div className='control'>
    <label>Methane</label>
    <div>{(props.methaneTons*1000).toFixed(1)} kg</div>
  </div>}
  {props.curtailed && <div className='control'>
    <label>Curtailment</label>
    <div>Habitat: {props.curtailed.habitat}%</div>
    <div>Sabatier: {props.curtailed.sabatier}%</div>
  </div>}
</div>

export default Results
