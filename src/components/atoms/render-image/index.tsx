import { Skeleton } from '@mui/material'
import {
  useEffect,
  useState,
  type ImgHTMLAttributes,
  type ReactNode,
} from 'react'

type RenderImageProps = {
  src?: string
  fallback?: ReactNode
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'>

const RenderImage = ({
  src,
  fallback,
  alt = '',
  className,
  style,
  onLoad,
  onError,
  ...props
}: RenderImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return fallback ? (
      <div className={className} style={style}>
        {fallback}
      </div>
    ) : null
  }

  if (!loaded) {
    return (
      <>
        <Skeleton
          variant="rounded"
          animation="wave"
          className={className}
        />

        <img
          src={src}
          alt={alt}
          style={{ display: 'none' }}
          onLoad={(e) => {
            setLoaded(true)
            onLoad?.(e)
          }}
          onError={(e) => {
            setFailed(true)
            onError?.(e)
          }}
          {...props}
        />
      </>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  )
}

export default RenderImage