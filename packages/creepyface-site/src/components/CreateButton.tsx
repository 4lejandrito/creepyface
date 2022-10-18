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
import Button from './Button'
import { useTranslate } from './Language'
import { useDispatch, useSelector } from './State'
import { setIsCreating } from '../redux/actions'
import { useTheme } from './Theme'

const CreepyFaceCreatorModal = lazy(() => import('./CreepyFaceCreatorModal'))
const CreateContext = createContext({
  loading: false,
  open: false,
  navigate: false,
  toggleOpen: () => {},
})

export function CreateProvider(props: {
  open?: boolean
  navigate?: boolean
  children: ReactNode | ReactNode[]
}) {
  const [modalLoaded, setModalLoaded] = useState(false)
  const isCreating = useSelector((state) => state.isCreating)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(setIsCreating(!!props.open)())
  }, [props.open, dispatch])

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
          [modalLoaded, props.navigate, isCreating, dispatch]
        )}
      >
        {props.children}
        {(isCreating || modalLoaded) && (
          <Suspense fallback={null}>
            <CreepyFaceCreatorModal
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
  const theme = useTheme()
  return (
    <Button
      className={theme.secondaryColor ? 'custom' : 'invert'}
      loading={open && loading}
      icon="create"
      href={navigate ? '/create' : undefined}
      onClick={navigate ? undefined : toggleOpen}
    >
      {translate('Create yours')}
    </Button>
  )
}
