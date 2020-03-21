import React, { ReactNode, useLayoutEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'
import { useSelector, useDispatch } from './State'
import { BrowserRouter } from 'react-router-dom'

function Routes({ children }: { children: ReactNode | ReactNode[] }) {
  const previousIsCreating = useSelector(state => state.isCreating)
  const isCreating = !!useRouteMatch('/create')
  const dispatch = useDispatch()

  useLayoutEffect(() => {
    if (isCreating !== previousIsCreating) {
      dispatch(
        isCreating ? { type: 'startCreation' } : { type: 'stopCreation' }
      )
    }
  }, [previousIsCreating, isCreating])

  return <>{children}</>
}

export default function Router({
  children
}: {
  children: ReactNode | ReactNode[]
}) {
  return (
    <BrowserRouter>
      <Routes>{children}</Routes>
    </BrowserRouter>
  )
}
