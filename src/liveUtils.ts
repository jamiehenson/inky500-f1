export const nationalityLookup = (country: string) => {
  switch (country) {
    case 'Denmark':
      return 'dk'
    case 'Norway':
      return 'no'
    case 'Spain':
      return 'es'
    case 'Austria':
      return 'au'
    case 'USA':
      return 'us'
    case 'Netherlands':
      return 'nl'
    case 'France':
      return 'fr'
    case 'Poland':
      return 'pl'
    case 'Luxembourg':
      return 'lu'
    case 'Turkey':
      return 'tr'
    case 'GreatBritain':
      return 'gb'
    default:
      return 'xx'
  }
}

export const carLookup = (model: number) => {
  switch (model) {
    case 60:
      return 'mercedes'
    case 59:
      return 'mclaren'
    case 52:
      return 'audi'
    case 57:
      return 'ktm'
    case 56:
      return 'ginetta'
    case 53:
      return 'bmw'
    case 55:
      return 'chevrolet'
    case 51:
      return 'astonmartin'
    case 61:
      return 'porsche'
    case 50:
      return 'alpine'
    case 58:
      return 'maserati'
    default:
      return 'renault'
  }
}
