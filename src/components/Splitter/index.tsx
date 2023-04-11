import { ReactElement, useRef, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import './index.css'

interface Props {
  left: ReactElement
  right: ReactElement
}

function Splitter({ left, right }: Props) {
  const resizer = useRef<HTMLDivElement>(null)
  // const leftSide = createRef<HTMLDivElement>()
  // const rightSide = createRef<HTMLDivElement>()
  // The current position of mouse
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  // Width of left side
  const [leftWidth, setLeftWidth] = useState(0)

  const handleMouseDown = (e: any) => {
    if (!resizer.current) return

    setX(e.clientX)
    setY(e.clientY)
    const leftSide = resizer.current.previousElementSibling as HTMLElement

    setLeftWidth(leftSide.getBoundingClientRect().width)
    document.addEventListener('mousemove', handleMousemove)
    document.addEventListener('mouseup', handleMouseup)
  }

  const handleMousemove = (e: any) => {
    if (!resizer.current) return
    const dx = e.clientX - x
    const dy = e.clientY - y
    const parentNode = resizer.current.parentNode as any
    const leftSide = resizer.current.previousElementSibling as HTMLElement
    const rightSide = resizer.current.nextElementSibling as HTMLElement
    const newLeftWidth = ((leftWidth + dx) * 100) / parentNode.getBoundingClientRect().width
    leftSide.style.width = `${newLeftWidth}%`

    document.body.style.cursor = 'col-resize'

    leftSide.style.userSelect = 'none'
    leftSide.style.pointerEvents = 'none'

    rightSide.style.userSelect = 'none'
    rightSide.style.pointerEvents = 'none'
  }
  const handleMouseup = (e: any) => {
    if (!resizer.current) return
    const leftSide = resizer.current.previousElementSibling as HTMLElement
    const rightSide = resizer.current.nextElementSibling as HTMLElement

    resizer.current.style.removeProperty('cursor')
    document.body.style.removeProperty('cursor')

    leftSide.style.removeProperty('user-select')
    leftSide.style.removeProperty('pointer-events')

    rightSide.style.removeProperty('user-select')
    rightSide.style.removeProperty('pointer-events')

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', handleMousemove)
    document.removeEventListener('mouseup', handleMouseup)
  }

  return (
    <Flex className="h-full w-full">
      {left}
      <div ref={resizer} className="resizer" onMouseDown={handleMouseDown} />
      {right}
    </Flex>
  )
}

export default Splitter
