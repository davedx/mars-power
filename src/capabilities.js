const caps = {
  kilopower: {
    kwPerUnit: 10.0,
    mass: 1800
  },
  pvArray: {
    kwPerUnit: 5.0,
    mass: 30,
    area: 1.5 * 15 // 15 panels
  },
  battery: {
    // based on Tesla powerpack/Model S battery
    kWhPerUnit: 100,
    kwPerUnit: 50,
    mass: 590
  },
  sabatier: {
    tonPerMWh: 1/17,
    kWPerUnit: 0.7,
    mass: 50
  },
  colonist: {
    kWPerUnit: 3,
    mass: 100
  }
}

export {caps}
