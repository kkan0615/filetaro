import { Button, Card, CardBody, CardFooter, Flex, IconButton, Spacer, Text, Tooltip } from '@chakra-ui/react'
import { BiArrowBack } from 'react-icons/bi'
import { AiOutlineHome } from 'react-icons/ai'
import { MdDeleteForever } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import AddFilesFromDirectoryDialog from '@renderer/components/dialogs/AddFilesFromDirectory'
import { getTargetFileTypeByExt, TargetFile } from '@renderer/types/models/targetFile'
import AddFileBtn from '@renderer/components/buttons/AddFile'
import { path } from '@tauri-apps/api'
import { toast } from 'react-toastify'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { addSlideTargetFile, setSlidesIndex } from '@renderer/stores/slices/slides'
import SlidesPreviewElement from '@renderer/components/slides/PreviewElement'
import { useEffect, useMemo, useState } from 'react'
import { NO_SLIDE_INDEX } from '@renderer/types/models/slide'
import { convertFileSrc } from '@tauri-apps/api/tauri'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { deleteTargetFiles } from '@renderer/utils/file'

function SlidesLeft() {
  const { t } = useTranslation()
  const targetFiles = useSelector((state: RootState) => state.slides.targetFiles)
  const slideIndex = useSelector((state: RootState) => state.slides.slideIndex)
  const dispatch = useDispatch()

  const [assetUrl, setAssetUrl] = useState('')

  const targetFileByIndex = useMemo(() => {
    if (slideIndex === NO_SLIDE_INDEX || targetFiles.length <= slideIndex) {
      return null
    }

    return targetFiles[slideIndex]
  }, [targetFiles, slideIndex])

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

  const addFiles = async (filePaths: string[]) => {
    try {
      await Promise.all(
        filePaths.map(async (filePathEl, index) => {
          dispatch(
            addSlideTargetFile({
              name: await path.basename(filePathEl),
              type: getTargetFileTypeByExt(await path.extname(filePathEl)),
              ext: await path.extname(filePathEl),
              checked: false,
              path: filePathEl,
            })
          )
        })
      )

      if (filePaths.length && slideIndex === NO_SLIDE_INDEX) dispatch(setSlidesIndex(0))
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('texts.alerts.addFilesError')), {
        type: 'error'
      })
    }
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      handleNext()
    } else if (event.key === 'ArrowLeft') {
      handlePrev()
    }
  }

  const handlePrev = () => {
    if (slideIndex > 0) {
      setAssetUrl('')
      dispatch(setSlidesIndex(slideIndex - 1))
    }
  }

  const handleNext = () => {
    if (slideIndex < targetFiles.length - 1) {
      setAssetUrl('')
      dispatch(setSlidesIndex(slideIndex + 1))
    }
  }

  const loadFiles = async (files: TargetFile[]) => {
    files.map((fileEl) => {
      dispatch(
        addSlideTargetFile({
          ...fileEl,
          checked: false,
        })
      )
    })

    if (files.length && slideIndex === NO_SLIDE_INDEX) dispatch(setSlidesIndex(0))
  }

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

  /**
   * Delete (move to garbage) current file
   */
  const deleteCurrentFile = async () => {
    try {
      if (!targetFileByIndex) return
      await deleteTargetFiles([targetFileByIndex])
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div
      className="h-full flex flex-col relative"
      style={{
        width: '75%', // w-9/12 not working because of important
      }}
    >
      {targetFiles.length ?
        <>
          <div className="min-h-0 shrink px-2 py-1 relative">
            <Flex alignItems="center" justifyContent='space-between'>
              <Flex style={{ flex: 1 }}>
                <Link to="/">
                  <Tooltip label={capitalizeFirstLetter(t('tooltips.home'))}>
                    <IconButton
                      variant="ghost"
                      aria-label={t('tooltips.home')}
                      icon={<AiOutlineHome className="text-2xl" />}
                    />
                  </Tooltip>
                </Link>
                <AddFileBtn onSelected={addFiles} />
                <AddFilesFromDirectoryDialog onAddFiles={loadFiles} />
              </Flex>
              <Flex style={{ flex: 1 }} justifyContent='center'>
                <span className="truncate">{targetFileByIndex?.name}</span>
              </Flex>
              <Flex style={{ flex: 1 }}>
                {/*right*/}
              </Flex>
            </Flex>
          </div>
          <div className="grow h-1 overflow-auto relative">
            <Tooltip label={capitalizeFirstLetter(t('tooltips.prev'))}>
              <IconButton
                onClick={handlePrev}
                textColor="white"
                colorScheme="primary"
                className="absolute top-1/2 left-4 z-20"
                aria-label="prev"
                isDisabled={slideIndex === 0}
                icon={<AiOutlineLeft className="text-xl" />}
              />
            </Tooltip>
            <div className="h-full flex items-center justify-center">
              <SlidesPreviewElement
                targetFile={targetFileByIndex}
                assetUrl={assetUrl}
              />
            </div>
            <Tooltip label={capitalizeFirstLetter(t('tooltips.next'))}>
              <IconButton
                onClick={handleNext}
                textColor="white"
                colorScheme="primary"
                className="absolute top-1/2 right-4 z-20"
                aria-label="home"
                isDisabled={slideIndex === targetFiles.length - 1}
                icon={<AiOutlineRight className="text-xl" />}
              />
            </Tooltip>
          </div>
          <div className="min-h-0 shrink px-2 py-1">
            <Flex alignItems="center">
              <Text className="truncate">
                {slideIndex + 1} / {targetFiles.length} - {targetFileByIndex?.path}
              </Text>
              <Spacer />
              {slideIndex !== NO_SLIDE_INDEX &&
                <Tooltip label={capitalizeFirstLetter(t('tooltips.deleteFiles'))}>
                  <IconButton
                    colorScheme="error"
                    id="delete-file-button"
                    onClick={deleteCurrentFile}
                    variant="ghost"
                    aria-label={capitalizeFirstLetter(t('tooltips.deleteFiles'))}
                    icon={<MdDeleteForever className="text-2xl" />}
                  />
                </Tooltip>}
            </Flex>
          </div>
        </> :
        <div className="h-full flex items-center justify-center">
          <div>
            <Card className="text-base-content" paddingBottom={1}>
              <CardBody className="text-center">
                <Text className='text-xl'>{capitalizeFirstLetter(t('pages.slides.labels.beforeStart'))}</Text>
              </CardBody>
              <CardFooter justifyContent='center' paddingTop={1}>
                <AddFileBtn onSelected={addFiles} />
                <AddFilesFromDirectoryDialog onAddFiles={loadFiles} />
              </CardFooter>
            </Card>
            <Link to="/">
              <Button
                className="mt-4"
                leftIcon={<BiArrowBack />}
                variant="ghost"
              >
                {capitalizeFirstLetter(t('labels.back'))}
              </Button>
            </Link>
          </div>
        </div>
      }
    </div>
  )
}

export default SlidesLeft
