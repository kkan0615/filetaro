import { useEffect, useState } from 'react'
import { path } from '@tauri-apps/api'
import { toast } from 'react-toastify'
import { Card, Tooltip, IconButton, CardBody, Flex, Kbd } from '@chakra-ui/react'
import { AiOutlineClose } from 'react-icons/ai'
import { MoveDirectory } from '@renderer/types/models/move'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { removeTargetFile, setMovesSlideIndex } from '@renderer/stores/slices/moves'
import { moveOrCopyFile } from '@renderer/utils/file'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import DirectoryCardKbdDialog from '@renderer/components/moves/DirectoryCardKbdDialog'
import _ from 'lodash'
import { getKBD } from '@renderer/utils/keyboard'
import { NO_SLIDE_INDEX } from '@renderer/types/models/slide'

interface Props {
  directory: MoveDirectory
  onRemove: (directory: MoveDirectory) => void
}

export function MovesDirectoryCard({ directory, onRemove }: Props) {
  const { t } = useTranslation()

  const targetFiles = useSelector((state: RootState) => state.moves.targetFiles)
  const slideIndex = useSelector((state: RootState) => state.moves.movesSlideIndex)
  const checkedTargetFiles = useSelector((state: RootState) => state.moves.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.moves.setting)
  const isBlockKey = useSelector((state: RootState) => state.moves.isBlockKey)
  const dispatch = useDispatch()

  const [directoryName, setDirectoryName] = useState('')

  useEffect(() => {
    path.basename(directory.path)
      .then(value => setDirectoryName(value))
  }, [directory])

  useEffect(() => {
    if (!isBlockKey) window.addEventListener('keyup', handleKeyup)
    return () => {
      window.removeEventListener('keyup', handleKeyup)
    }
  }, [directory, checkedTargetFiles, isBlockKey])

  const handleKeyup = async (event: KeyboardEvent) => {
    const kbd = getKBD(event)
    if (!kbd.length) return

    console.log(kbd, _.isEqual(directory.kbd ,kbd), checkedTargetFiles.length)
    if (_.isEqual(directory.kbd ,kbd) && checkedTargetFiles.length) {
      await handleCard()
    }
  }

  /**
   * Click event for Card
   */
  const handleCard = async () => {
    try {
      console.log('why?')
      if (slideIndex === NO_SLIDE_INDEX && checkedTargetFiles.length === 0) {
        toast(capitalizeFirstLetter(t('pages.moves.texts.alerts.noSelectFileWarn')), {
          type: 'warning'
        })
        return
      }
      // -1 means it's not slideshow mode.
      if (slideIndex === NO_SLIDE_INDEX) {
        await Promise.all(checkedTargetFiles.map(async (checkedTargetFileEl) => {
          const isDone = await moveOrCopyFile({
            file: checkedTargetFileEl,
            directoryPath: directory.path,
            isAutoDuplicatedName: setting.isAutoDuplicatedName,
            isCopy: setting.isKeepOriginal
          })
          if (isDone)
            dispatch(removeTargetFile(checkedTargetFileEl.path))
        }))
      } else {
        // File by index
        const targetFileByIndex = targetFiles[slideIndex]

        const isDone = await moveOrCopyFile({
          file: targetFileByIndex,
          directoryPath: directory.path,
          isAutoDuplicatedName: setting.isAutoDuplicatedName,
          isCopy: setting.isKeepOriginal
        })
        if (isDone) {
          // new index of slide
          let newSlideIndex = 0
          if (targetFiles.length === 1) newSlideIndex = -1
          else if(slideIndex !== 0) newSlideIndex = slideIndex - 1
          dispatch(setMovesSlideIndex(newSlideIndex))
          dispatch(removeTargetFile(targetFileByIndex.path))
        }
      }

      toast(capitalizeFirstLetter(t('pages.moves.texts.alerts.moveSuccess')), {
        type: 'success'
      })
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('pages.moves.texts.alerts.moveError')), {
        type: 'error'
      })
    }
  }

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onRemove(directory)
  }

  return (
    <Card
      onClick={handleCard}
      className="relative cursor-pointer hover:scale-105 transition ease-in-out duration-300"
    >
      <Tooltip label={capitalizeFirstLetter(t('labels.removeDirectory'))}>
        <IconButton
          variant="solid"
          size="xs"
          className="rounded-full absolute -top-2 -right-2"
          aria-label={capitalizeFirstLetter(t('labels.removeDirectory'))}
          onClick={handleRemove}
        >
          <AiOutlineClose className="text-md" />
        </IconButton>
      </Tooltip>
      <CardBody>
        <div className="space-y-2">
          <Flex alignItems="center">
            <div className="w-3/12">{capitalizeFirstLetter(t('labels.name'))}:</div>
            <div>{directoryName}</div>
          </Flex>
          <Flex alignItems="center">
            <div className="w-3/12">{capitalizeFirstLetter(t('labels.path'))}:</div>
            <div className="break-all">{directory.path}</div>
          </Flex>
          <div className="flex">
            <div className="flex gap-x-2">
              {directory.kbd?.map((kbdEl) => (
                <Kbd key={kbdEl}>
                  {kbdEl}
                </Kbd>
              ))}
            </div>
            <DirectoryCardKbdDialog directory={directory} />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default MovesDirectoryCard
