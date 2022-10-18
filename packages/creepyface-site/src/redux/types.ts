import { ThunkDispatch } from 'redux-thunk'
import { Namespace } from '../util/namespaces'
import { Theme } from '../util/theme'

export type Picture = {
  blob: Blob
  src: string
}

export const angles = [0, 45, 90, 135, 180, 225, 270, 315] as const
export const looks = ['serious', 'hover', ...angles] as const
export type Angle = typeof angles[number]
export type Look = typeof looks[number]
export type Pictures = { [K in Look]: Picture }

export type Language = 'en' | 'es'

export type State = {
  namespace: Namespace | null
  shortcuts: boolean
  shoot: (() => Picture) | null
  pictures: Partial<Pictures>
  permissions: { [K in 'download' | 'samples' | 'research' | 'show']: boolean }
  uploading: boolean
  downloadLink: string | null
  viewLink: string | null
  selectedCreepyface: number | null
  showCode: boolean
  pointProvider: 'pointer' | 'firefly' | 'dance'
  isCreating: boolean
  theme: Theme
  reload: (() => void) | null
}

export type Action =
  | {
      type: 'toggleShortcuts'
    }
  | {
      type: 'videoReady'
      payload: () => Picture
    }
  | {
      type: 'videoNotReady'
    }
  | {
      type: 'takePicture'
      payload: Picture
    }
  | {
      type: 'startCreation'
    }
  | {
      type: 'stopCreation'
    }
  | {
      type: 'restartCreation'
    }
  | {
      type: 'showPermissions'
    }
  | {
      type: 'toggleDownloadPermission'
    }
  | {
      type: 'toggleResearchPermission'
    }
  | {
      type: 'toggleSamplesPermission'
    }
  | {
      type: 'requestUpload'
    }
  | {
      type: 'receiveUpload'
      payload: {
        download: string
        view: string
        count: number
      }
    }
  | {
      type: 'uploadFailed'
    }
  | {
      type: 'selectCreepyface'
      payload: number
    }
  | {
      type: 'toggleCode'
    }
  | {
      type: 'changePointProvider'
      payload: State['pointProvider']
    }
  | {
      type: 'setReload'
      payload: State['reload']
    }
  | {
      type: 'setTheme'
      payload: Theme
    }

export type Dispatch = ThunkDispatch<State, void, Action>
