import { Theme } from '../util/theme'

export type Namespace = {
  key: string
  name: string
  url: string
  logo: string
  theme: Theme
}

export const namespaces: {
  [K in string]?: Namespace
} = {
  liferay: {
    key: 'liferay',
    name: 'Liferay',
    url: 'https://liferay.com',
    logo: '/liferay.svg',
    theme: {
      primaryColor: '#0b63ce',
      defaultUuid: 'ray',
      song: 'vivaLaVida',
    },
  },
}
