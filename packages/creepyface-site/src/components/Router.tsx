import React, { ReactNode, useEffect } from 'react'
import { useSelector, useDispatch } from './State'
import { useRouter } from 'next/router'

function Routes({ children }: { children: ReactNode | ReactNode[] }) {
  const router = useRouter()
  const previousIsCreating = useSelector((state) => state.isCreating)
  const isCreating = router.asPath.endsWith('/create')
  const dispatch = useDispatch()

  useEffect(() => {
    if (isCreating !== previousIsCreating) {
      dispatch(
        isCreating ? { type: 'startCreation' } : { type: 'stopCreation' }
      )
    }
  }, [previousIsCreating, isCreating])

  return <>{children}</>
}

export default function Router({
  children,
}: {
  children: ReactNode | ReactNode[]
}) {
  return <Routes>{children}</Routes>
}
