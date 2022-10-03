import React, { ReactNode } from 'react'
import classNames from 'classnames'
import Icon, { IconType } from './Icon'
import Loader from './Loader'
import Link from './Link'
import { useShortcuts } from './Shortcuts'
import { useDispatch, useSelector } from './State'
import { useTranslate } from './Language'
import { ActionCreator } from '../redux/util'

type Props = {
  type?: string
  children?: ReactNode | ReactNode[]
  className?: string
  icon?: IconType
  loading?: boolean
  title?: string
  onClick?: () => void
  action?: ActionCreator
  disabled?: boolean
  showShortcut?: boolean
  href?: string | null
  download?: boolean
}

export default function Button({
  type,
  children,
  className,
  icon,
  loading,
  title,
  onClick,
  action,
  disabled,
  showShortcut,
  href,
  download,
}: Props) {
  const state = useSelector((state) => state)
  const dispatch = useDispatch()
  const shortcuts = useShortcuts()
  const translate = useTranslate()
  const shortcut = action ? shortcuts.shortcut(action) : null

  if (href) {
    return (
      <Link
        download={download}
        href={href}
        title={title}
        className={classNames(className, type, 'button')}
      >
        <>
          {loading ? <Loader /> : icon && <Icon name={icon} />}
          {(loading || icon) && ' '}
          {children}
        </>
      </Link>
    )
  } else {
    return (
      <button
        disabled={
          disabled ||
          loading ||
          (!onClick && !action) ||
          (action && !action.enabled(state))
        }
        title={title}
        onClick={onClick || (action && (() => dispatch(action())))}
        className={classNames(className, type)}
      >
        <>
          {loading ? <Loader /> : icon && <Icon name={icon} />}
          {(loading || icon) && ' '}
          {children}
          {action &&
            shortcut &&
            (showShortcut ? (
              <>
                {' '}
                <small className="shortcut-inline">
                  ({translate('or press')} <kbd>{shortcut}</kbd>)
                </small>
              </>
            ) : (
              shortcuts.show && (
                <small className="shortcut">
                  <kbd>{shortcut}</kbd>
                </small>
              )
            ))}
        </>
      </button>
    )
  }
}
