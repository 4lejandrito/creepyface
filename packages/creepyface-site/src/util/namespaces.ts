import * as vivaLaVida from '../songs/viva-la-vida'

export const namespaces: {
  [K in string]?: {
    key: string
    name: string
    url: string
    logo: string
    color: string
    color2: string
    color3: string
    defaultUuid: string
    song: any
  }
} = {
  liferay: {
    key: 'liferay',
    name: 'Liferay',
    url: 'https://liferay.com',
    logo: '/liferay.svg',
    color: '#0b63ce',
    color2: 'white',
    color3: '#0b63ce',
    defaultUuid: 'ray',
    song: vivaLaVida,
  },
  devcon: {
    key: 'devcon',
    name: 'Devcon',
    url: 'https://www.liferay.com/es/web/events/devcon2022',
    logo: '/devcon.svg',
    color: '#60236b',
    color2: '#fdd314',
    color3: 'rgb(0, 59, 86)',
    defaultUuid: 'ray',
    song: vivaLaVida,
  },
}
