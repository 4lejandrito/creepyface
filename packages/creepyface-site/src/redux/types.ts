import { ThunkDispatch } from 'redux-thunk'

export type Picture = {
  blob: Blob
  src: string
}

export type ValidAngle = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315
export type Pictures = { [K in 'serious' | 'hover' | ValidAngle]: Picture }

export type Language = 'en' | 'es'

export type State = {
  locale: {
    value: Language
    loading: boolean
    messages?: {
      [T: string]: string
    }
  }
  shortcuts: boolean
  shoot: (() => Picture) | null
  pictures: Partial<Pictures>
  permissions: { [K in 'download' | 'samples' | 'research' | 'show']: boolean }
  uploading: boolean
  downloadLink: string | null
  viewLink: string | null
  selectedCreepyface: number
  count: number | null
  showCode: boolean
  pointProvider: 'pointer' | 'firefly' | 'dance'
  isCreating: boolean
}

export type Action =
  | {
      type: 'requestMessages'
      payload: Language
    }
  | {
      type: 'receiveMessages'
      payload: { value: Language; messages?: { [K: string]: string } }
    }
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
      type: 'receiveCount'
      payload: number
    }
  | {
      type: 'toggleCode'
    }
  | {
      type: 'changePointProvider'
      payload: State['pointProvider']
    }

export type Dispatch = ThunkDispatch<State, void, Action>

export type Namespace = string | undefined
