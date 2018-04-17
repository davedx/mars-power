import _ from 'lodash'
import {caps} from './capabilities'

const calculatePvOutput = ({ hour, env, state }) => {
  const maxPvOutput = state.pvArray * caps.pvArray.kwPerUnit

  // calculate solar irradiance accounting for any storms
  let irradiance = Math.max(0, Math.sin(2*Math.PI * (hour-6)/24))

  if (env.stormHrs === 0 && Math.random() < (0.3/24)) {
    env.stormHrs = ~~(Math.random()*24*3) // max 3 days
  }
  if (env.stormHrs > 0) {
    env.stormHrs -= 1
    irradiance *= _.random(0.18, 0.25)
  }

  return irradiance * maxPvOutput
}

const calculateKilopowerOutput = ({ hour, env, state }) => {
  return state.kilopower * caps.kilopower.kwPerUnit
}

const calculateSabatierDemand = ({ hour, env, state }) => {
  return state.sabatier * caps.sabatier.kWPerUnit
}

const calculcateHabitatDemand = ({ hour, env, state }) => {
  return state.colonist * caps.colonist.kWPerUnit
}

const calculateOutput = (params) => {

  const pvArrayKw = calculatePvOutput(params)
  const kilopowerKw = calculateKilopowerOutput(params)

  const sabatierDemandKw = calculateSabatierDemand(params)
  const habitatDemandKw = calculcateHabitatDemand(params)

  const generationKw = kilopowerKw + pvArrayKw
  let batteryOutputKw = 0

  let supply = generationKw
  let consumptionKw = 0

  const maxBatteryCapacity = params.state.battery * caps.battery.kWhPerUnit
  const batteryKwp = params.state.battery * caps.battery.kwPerUnit

  let priorities = [
    {name: 'habitat', value: habitatDemandKw, curtailed: false, usesBattery: true},
    {name: 'sabatier', value: sabatierDemandKw, curtailed: false, usesBattery: false}
  ]

  if (params.state.batteryStrategy === '1') {
    priorities[1].usesBattery = true
  }

  for (let i = 0; i < priorities.length; i++) {
    const name = priorities[i].name

    let consumed = Math.min(supply, priorities[i].value)
    supply -= consumed

    if (consumed < priorities[i].value) {
      if (params.env.currentCharge > 0
        && priorities[i].usesBattery) {

        const batteryMaxDischarge = Math.min(params.env.currentCharge, batteryKwp)
        const batteryDelta = Math.min(batteryMaxDischarge, priorities[i].value - consumed)

        //console.log(`Dispatching battery for ${name}: ${batteryDelta}`)
        params.env.currentCharge -= batteryDelta
        consumed += batteryDelta
        batteryOutputKw += batteryDelta
      }

      priorities[i].curtailed = consumed < priorities[i].value
      priorities[i].value = consumed

      if (priorities[i].curtailed) {
        params.env.curtailed[name] += 1
      }
    }

    if (priorities[i].name === 'sabatier'
      && priorities[i].value > 0) {
      let methaneDelta = (priorities[i].value/1000) /* MW */ * caps.sabatier.tonPerMWh
      params.env.currentMethane += methaneDelta
    }
    consumptionKw += consumed
  }

  if (supply > 0) {
    // recharge batteries
    let batteryDelta = Math.min(maxBatteryCapacity - params.env.currentCharge, supply)
    params.env.currentCharge += batteryDelta
    supply -= batteryDelta
  }


  return {generationKw, consumptionKw, batteryOutputKw}
}

export {calculateOutput}
