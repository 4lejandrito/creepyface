import Shortcuts from './Shortcuts'
import { useRouter } from 'next/router'
import React, {
  createContext,
  lazy,
  ReactNode,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Namespace } from '../redux/types'
import Button from './Button'
import { useTranslate } from './Language'
import { useDispatch, useSelector } from './State'

const CreepyFaceCreatorModal = lazy(() => import('./CreepyFaceCreatorModal'))
const CreateContext = createContext({
  loading: false,
  open: false,
  navigate: false,
  toggleOpen: () => {},
})

export function CreateProvider(props: {
  namespace?: Namespace
  open?: boolean
  navigate?: boolean
  children: ReactNode | ReactNode[]
}) {
  const [modalLoaded, setModalLoaded] = useState(false)
  const isCreating = useSelector((state) => state.isCreating)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch({ type: props.open ? 'startCreation' : 'stopCreation' })
  }, [props.open])

  return (
    <Shortcuts>
      <CreateContext.Provider
        value={useMemo(
          () => ({
            loading: !modalLoaded,
            open: isCreating,
            navigate: !!props.navigate,
            toggleOpen: () =>
              dispatch({
                type: !isCreating ? 'startCreation' : 'stopCreation',
              }),
          }),
          [modalLoaded, props.navigate, isCreating]
        )}
      >
        {props.children}
        {(isCreating || modalLoaded) && (
          <Suspense fallback={null}>
            <CreepyFaceCreatorModal
              namespace={props.namespace}
              isOpen={isCreating}
              onOpen={() => setModalLoaded(true)}
              onClose={() =>
                props.navigate
                  ? router.push('/')
                  : dispatch({ type: 'stopCreation' })
              }
            />
          </Suspense>
        )}
      </CreateContext.Provider>
    </Shortcuts>
  )
}

export default function CreateButton() {
  const { open, loading, navigate, toggleOpen } = useContext(CreateContext)
  const translate = useTranslate()

  return (
    <Button
      className="create-button"
      loading={open && loading}
      icon="create"
      href={navigate ? '/create' : undefined}
      onClick={navigate ? undefined : toggleOpen}
    >
      {translate('Create yours')}
    </Button>
  )
}
