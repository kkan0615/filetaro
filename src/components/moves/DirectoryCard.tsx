import { useEffect, useState } from 'react'
import { path } from '@tauri-apps/api'
import { toast } from 'react-toastify'
import { Card, Tooltip, IconButton, CardBody, Flex } from '@chakra-ui/react'
import { AiOutlineClose } from 'react-icons/ai'
import { MoveDirectory } from '@renderer/types/models/move'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { removeTargetFile, setMovesSlideIndex } from '@renderer/stores/slices/moves'
import { moveOrCopyFile } from '@renderer/utils/file'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

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
  const dispatch = useDispatch()

  const [directoryName, setDirectoryName] = useState('')

  useEffect(() => {
    path.basename(directory.path)
      .then(value => setDirectoryName(value))
  }, [directory])

  /**
   * Click event for Card
   */
  const handleCard = async () => {
    try {
      if (slideIndex === -1 && checkedTargetFiles.length === 0) {
        toast(capitalizeFirstLetter(t('pages.moves.texts.alerts.noSelectFileWarn')), {
          type: 'warning'
        })
        return
      }
      // -1 means it's not slideshow mode.
      if (slideIndex === -1) {
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

  const handleChangeKbd = () => {
    //
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
        </div>
        {/*{directory.kbd ? (*/}
        {/*  <div className="flex">*/}
        {/*    {directory.kbd.map((kbdEl) => (*/}
        {/*      <div key={kbdEl} className="kbd">*/}
        {/*        {kbdEl}*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*) : null}*/}
      </CardBody>
    </Card>
  )
}

export default MovesDirectoryCard
