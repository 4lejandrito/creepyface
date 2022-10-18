import { PropsWithChildren } from 'react'
import { useSelector } from './State'

export const useTheme = () => useSelector((state) => state.theme)

export default function ThemeProvider(props: PropsWithChildren) {
  const theme = useTheme()
  const secondaryColor = theme.secondaryColor ?? theme.primaryColor
  return (
    <>
      {theme.primaryColor && (
        <style jsx global>{`
          :root {
            --color-custom-primary: ${theme.primaryColor};
          }
        `}</style>
      )}
      {secondaryColor && (
        <style jsx global>{`
          :root {
            --color-custom-secondary: ${secondaryColor};
          }
        `}</style>
      )}
      {theme.background && (
        <>
          <style jsx global>{`
            .background {
              background-image: url('${theme.background}');
              background-repeat: repeat;
              background-size: 768px;
              position: absolute;
              inset: 0;
              opacity: 0.03;
              z-index: -1;
            }
          `}</style>
          <div className="background" />
        </>
      )}
      {props.children}
    </>
  )
}
