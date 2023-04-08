import { useEffect, useMemo, useState } from 'react'
import { AiOutlineClose, AiOutlineDelete, AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { removeTargetFile, setMovesSlideIndex } from '@renderer/stores/slices/moves'
import { AiOutlineFile } from 'react-icons/all'
import { TargetFiles } from '@renderer/types/models/targetFiles'
import { toast } from 'react-toastify'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { Fade, Card, CardBody, Heading, Tooltip, IconButton, Flex, Spacer, CardHeader, Image } from '@chakra-ui/react'

// @TODO: Move to components
 interface PreviewElementProps {
  slideTargetFileByIndex: TargetFiles | null
  assetUrl: string
}

function PreviewElement({ slideTargetFileByIndex, assetUrl }: PreviewElementProps) {
  // No file
  if (!slideTargetFileByIndex) {
    return (
      <div className="text-4xl">
        No data
      </div>
    )
  }
  // Image
  if (slideTargetFileByIndex.type === 'image') {
    return (
      <div className="text-center max-w-full max-h-full p-2">
        <Image
          objectFit='cover'
          src={assetUrl}
          alt={slideTargetFileByIndex.name}
        />
      </div>
    )
  }
  // Video
  if (slideTargetFileByIndex.type === 'video') {
    return (
      <div className="text-center max-w-full max-h-full p-2">
        <video src={assetUrl} controls>
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }
  // Just file
  return (
    <div>
      <div className="flex justify-center mb-2">
        <AiOutlineFile className="text-4xl"/>
      </div>
      <div className="text-xl">
        {slideTargetFileByIndex.name}
      </div>
    </div>
  )
}

interface Props {
  isOpen: boolean
  toggleOpen: () => void
}
function MovesSlideShow({ toggleOpen, isOpen }: Props) {
  const targetFiles = useSelector((state: RootState) => state.moves.targetFiles)
  const movesSlideIndex = useSelector((state: RootState) => state.moves.movesSlideIndex)
  const [assetUrl, setAssetUrl] = useState('')
  const dispatch = useDispatch()

  const targetFileByIndex = useMemo(() => {
    if (movesSlideIndex === -1 || targetFiles.length <= movesSlideIndex) {
      return null
    }

    return targetFiles[movesSlideIndex]
  }, [targetFiles, movesSlideIndex])

  useEffect(() => {
    loadFile()
      .catch(e => {
        console.error(e)
        toast('Error to load file', {
          type: 'error'
        })
        setAssetUrl('')
      })
  }, [targetFileByIndex])

  /**
   * Add keyboard arrow events to window
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [targetFileByIndex])

  /**
   * Load file buffer
   */
  const loadFile = async () => {
    if (!targetFileByIndex) {
      setAssetUrl('')
      return
    }

    const assetUrl = convertFileSrc(targetFileByIndex.path)
    setAssetUrl(assetUrl)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      handleNext()
    } else if (event.key === 'ArrowLeft') {
      handlePrev()
    }
  }

  const handlePrev = () => {
    if (movesSlideIndex > 0) {
      setAssetUrl('')
      dispatch(setMovesSlideIndex(movesSlideIndex - 1))
    }
  }

  const handleNext = () => {
    if (movesSlideIndex < targetFiles.length - 1) {
      setAssetUrl('')
      dispatch(setMovesSlideIndex(movesSlideIndex + 1))
    }
  }

  const handleClose = () => {
    toggleOpen()
  }

  const handleRemove = () => {
    if (targetFileByIndex) {
      dispatch(removeTargetFile(targetFileByIndex.path))
      let newSlideIndex = 0
      if (targetFiles.length === 1) newSlideIndex = -1
      else if(movesSlideIndex !== 0) newSlideIndex = movesSlideIndex - 1
      dispatch(setMovesSlideIndex(newSlideIndex))
    }
  }

  return (
    <Fade in={isOpen}>
      <div className="absolute h-full w-full p-4 z-50">
        <Card className="h-full">
          <CardHeader>
            <Flex alignItems="center" className="shrink">
              <Heading size="md">Slide Show ({movesSlideIndex + 1} / {targetFiles.length}) - {targetFileByIndex?.name}</Heading>
              <Spacer />
              <Tooltip label="Close">
                <IconButton
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  aria-label="home"
                  icon={<AiOutlineClose className="text-xl" />}
                />
              </Tooltip>
            </Flex>
          </CardHeader>
          <CardBody className="flex flex-col">
            <div className="h-1 grow relative">
              <Tooltip label="Prev">
                <IconButton
                  onClick={handlePrev}
                  colorScheme="primary"
                  variant="ghost"
                  size="sm"
                  className="absolute top-[40%] left-0 z-20"
                  aria-label="prev"
                  icon={<AiOutlineLeft className="text-xl" />}
                />
              </Tooltip>
              <div className="flex items-center justify-center h-full w-full z-20">
                {targetFileByIndex ?
                  <PreviewElement
                    slideTargetFileByIndex={targetFileByIndex}
                    assetUrl={assetUrl}
                  /> : null
                }
              </div>
              <Tooltip label="Next">
                <IconButton
                  onClick={handleNext}
                  colorScheme="primary"
                  variant="ghost"
                  size="sm"
                  className="absolute top-[40%] right-0 z-20"
                  aria-label="home"
                  icon={<AiOutlineRight className="text-xl" />}
                />
              </Tooltip>
              <div className="absolute bottom-2 left-2">
                {targetFileByIndex && <Tooltip label="Remove file from list">
                  <IconButton
                    onClick={handleRemove}
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-2 left-2"
                    aria-label="Remove file from list"
                    icon={<AiOutlineDelete className="text-xl" />}
                  />
                </Tooltip>}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </Fade>
  )
}

export default MovesSlideShow
