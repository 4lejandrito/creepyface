import { SongName } from '../components/Player'

export type Theme = {
  defaultUuid: string
  primaryColor?: string
  secondaryColor?: string
  background?: string
  name?: string
  song: SongName
  hat?: {
    url: string
    left: number
    top: number
    rotate: number
  }
}

const getCheckRange =
  (from: { month: number; day: number }, to: { month: number; day: number }) =>
  () => {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth()
    return (
      (month === from.month && day >= from.day) ||
      (month === to.month && day <= to.day)
    )
  }

const isChristmas = getCheckRange({ month: 11, day: 15 }, { month: 0, day: 7 })
const isHalloween = getCheckRange({ month: 9, day: 15 }, { month: 10, day: 2 })

export const defaultTheme: Theme = { defaultUuid: 'nala', song: 'stayingAlive' }

export const themes = {
  halloween: {
    defaultUuid: 'pumpkin',
    primaryColor: '#ff731d',
    secondaryColor: '#1a192e',
    background: '/halloween-bg.svg',
    name: 'Halloween',
    hat: {
      url: '/halloween-hat.png',
      top: 25,
      left: 88.5,
      rotate: 20,
    },
    song: 'addamsFamily',
  } as Theme,
  christmas: {
    ...defaultTheme,
    hat: {
      url: '/santa-hat.png',
      top: 10,
      left: 92,
      rotate: 30,
    },
  } as Theme,
  default: defaultTheme,
}

export const getTheme = (): Theme =>
  isHalloween()
    ? themes.halloween
    : isChristmas()
    ? themes.christmas
    : defaultTheme
