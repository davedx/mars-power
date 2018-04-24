import React from 'react'
import './App.css'
import Report from './Report'
import Results from './Results'
import {calculateOutput} from './simulator'
import {caps} from './capabilities'

const ten = [0,1,2,3,4,5,6,7,8,9,10]
const twenty = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
const hundred = [0,10,20,30,40,50,60,70,80,90,100]

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      duration: '30',
      kilopower: 0,
      pvArray: 0,
      battery: 0,
      sabatier: 0,
      colonist: 0,
      methane: [],
      methaneTons: 0,
      batteryStrategy: '0',
      labels: [],
      batteryCharge: [],
      generation: [],
      consumption: [],
      disabled: {}
    }
  }

  runSim() {
    // 1 month, 1 hour interval
    // 100 local dust storms per year
    // local dust storms last 2-3 days
    const generation = [], consumption = [], batteryCharge = [], labels = []
    let env = {
      stormHrs: 0,
      currentCharge: 0,
      currentMethane: 0,
      curtailed: {
        sabatier: 0,
        habitat: 0
      }
    }
    const totalHours = parseInt(this.state.duration, 10) * 24

    for (let i=0; i<totalHours; i++) {
      const {generationKw, consumptionKw, batteryOutputKW} = calculateOutput({ hour: i, env, state: this.state })
      generation.push(generationKw)
      consumption.push(consumptionKw)
      batteryCharge.push(env.currentCharge)

      labels.push(i)
    }

    this.setState({
      generation,
      consumption,
      batteryCharge,
      labels,
      methaneTons: env.currentMethane,
      curtailed: {
        habitat: (100*env.curtailed.habitat/totalHours).toFixed(2),
        sabatier: (100*env.curtailed.sabatier/totalHours).toFixed(2)
      }
    })
  }

  setStateFromSelect(e, key) {
    const val = e.target.options[e.target.selectedIndex].value
    this.setState({[key]: val})
  }

  toggleGraphLine(name) {
    const disabled = !this.state.disabled[name]
    this.setState({
      disabled: {
        ...this.state.disabled,
        [name]: disabled
      }
    })
  }

  render() {
    const kilopowerKw = this.state.kilopower * caps.kilopower.kwPerUnit
    const pvArrayKw = this.state.pvArray * caps.pvArray.kwPerUnit
    const maxKwe = kilopowerKw + pvArrayKw
    const batteryStorageKwh = this.state.battery * caps.battery.kWhPerUnit
    const batteryKwp = this.state.battery * caps.battery.kwPerUnit

    const kilopowerKg = this.state.kilopower * caps.kilopower.mass
    const pvArrayKg = this.state.pvArray * caps.pvArray.mass
    const batteryKg = this.state.battery * caps.battery.mass
    const sabatierKg = this.state.sabatier * caps.sabatier.mass
    const colonistKg = this.state.colonist * caps.colonist.mass
    const totalMassKg = kilopowerKg + pvArrayKg + batteryKg + sabatierKg + colonistKg
    const pvArea = this.state.pvArray * caps.pvArray.area

    const sabatierKw = this.state.sabatier * caps.sabatier.kWPerUnit
    const colonistKw = this.state.colonist * caps.colonist.kWPerUnit

    const reportProps = {
      ...this.state,
      toggleGraphLine: this.toggleGraphLine.bind(this)
    }

    return <div>
      <div className='sim'>
        <div className='controls'>
          <h3>Simulation parameters</h3>
          <h4>Supply</h4>
          <div>Colony kWp: {maxKwe} kWe</div>
          <div>Mass: {totalMassKg} kg</div>
          <div>PV area: {pvArea} m<sup>2</sup></div>
          <div className='control'>
            <label>Kilopower units (10 kWe)</label>
            <select onChange={(e) => this.setStateFromSelect(e, 'kilopower')}>
              {twenty.map(n => <option key={n}>{n}</option>)}
            </select>
            <div>{kilopowerKw} kWe</div>
          </div>
          <div className='control'>
            <label>PV arrays (5 kWe)</label>
            <select onChange={(e) => this.setStateFromSelect(e, 'pvArray')}>
              {hundred.map(n => <option key={n}>{n}</option>)}
            </select>
            <div>{pvArrayKw} kWe</div>
          </div>
          <div className='control'>
            <label>Batteries (100 kWh / 50 kW)</label>
            <select onChange={(e) => this.setStateFromSelect(e, 'battery')}>
              {twenty.map(n => <option key={n}>{n}</option>)}
            </select>
            <div>{batteryStorageKwh} kWh / {batteryKwp} kW</div>
          </div>
          <div className='control'>
            <label>Battery strategy</label>
            <div>• Recharge when excess supply</div>
            <div>• Discharge:</div>
            <select className='bat-strat' onChange={(e) => this.setStateFromSelect(e, 'batteryStrategy')}>
              <option value='0'>Power habitat if demand &gt; supply</option>
              <option value='1'>Power habitat then Sabatier if demand &gt; supply</option>
            </select>
          </div>
          <h4>Demand</h4>
          <div className='control'>
            <label>ISRU Sabatier CH<sub>4</sub> units</label>
            <select onChange={(e) => this.setStateFromSelect(e, 'sabatier')}>
              {hundred.map(n => <option key={n}>{n}</option>)}
            </select>
            <div>-{sabatierKw} kWe</div>
          </div>
          <div className='control'>
            <label>Life support, persons</label>
            <select onChange={(e) => this.setStateFromSelect(e, 'colonist')}>
              {twenty.map(n => <option key={n}>{n}</option>)}
            </select>
            <div>-{colonistKw} kWe</div>
          </div>
          <div className='control'>
            <label>Simulation duration</label>
            <select onChange={(e) => this.setStateFromSelect(e, 'duration')}>
              <option value='30'>30 days</option>
              <option value='90'>90 days</option>
              <option value='300'>300 days</option>
            </select>
          </div>
          <button onClick={(e) => this.runSim()}>Run sim</button>
          <Results {...this.state} />
        </div>
        <Report {...reportProps} />
      </div>
      <div className='refs'>
        <h3>Notes</h3>
        <p>Days and hours are Mars days and hours. KWh are also Mars KWh.</p>

        <h4>References</h4>
        <ol>
          <li><a href='https://ntrs.nasa.gov/archive/nasa/casi.ntrs.nasa.gov/20160012354.pdf'>Nuclear Systems Kilopower Overview</a></li>
          <li><a href='https://www.zonnepanelen.net/nl/zonnepaneel/sunpower-x21-335-blk/'>Solar panel example (SunPower X21)</a></li>
        </ol>
      </div>
    </div>
  }
}

export default App;
