import React, { createContext, ReactNode, useContext } from 'react'

const NamespaceContext = createContext('')

export default function NamespaceProvider(props: {
  namespace: string
  children: ReactNode | ReactNode[]
}) {
  return (
    <NamespaceContext.Provider value={props.namespace}>
      {props.children}
    </NamespaceContext.Provider>
  )
}

export const useNamespace = () => useContext(NamespaceContext)
