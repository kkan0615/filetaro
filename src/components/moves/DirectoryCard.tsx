import { AiOutlineClose } from 'react-icons/ai'
import { MoveDirectory } from '../../types/models/moveDirectory'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { copyFile, exists, renameFile } from '@tauri-apps/api/fs'
import { removeTargetFile, setMovesSlideIndex } from '@renderer/stores/slices/moves'
import { useEffect, useState } from 'react'
import { path } from '@tauri-apps/api'
import { toast } from 'react-toastify'
import { TargetFiles } from '@renderer/types/models/targetFiles'
import { Card, Tooltip, IconButton, CardBody, Flex } from '@chakra-ui/react'

interface Props {
  directory: MoveDirectory
  onRemove: (directory: MoveDirectory) => void
}

export function MovesDirectoryCard({ directory, onRemove }: Props) {
  const targetFiles = useSelector((state: RootState) => state.moves.targetFiles)
  const movesSlideIndex = useSelector((state: RootState) => state.moves.movesSlideIndex)
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
      if (movesSlideIndex === -1 && checkedTargetFiles.length === 0) {
        toast('Select file or open slide show mode', {
          type: 'warning'
        })
        return
      }

      if (setting.isKeepOriginal) {
        await copyFiles()
      } else {
        await moveFiles()
      }

      toast('Success to move file', {
        type: 'success'
      })
    } catch (e) {
      console.error(e)
      toast('Error to move file', {
        type: 'error'
      })
    }
  }

  /**
   * Check file name. If same file name is exists, prompt to type new name
   * @param targetFile {TargetFiles} - file
   * @return {string} - new file path
   */
  const checkAndPromptFileName = async (targetFile: TargetFiles) => {
    let newPath = `${directory.path}/${targetFile.name}`
    // Check duplicated file name
    // Number of increment
    let i = 1
    // Get file extension
    const splitName = targetFile.name.split('.')
    splitName.pop()
    while (await exists(newPath)) {
      // New file name
      let newFileName = ''
      // Automatically set the file name
      if (setting.isAutoDuplicatedName) {
        newFileName = `${splitName.join('')} (${i++}).${targetFile.ext}`
      } else {
        newFileName = prompt(`${targetFile.name} name is already exists, type new name of it`,
          `${splitName.join('')} (${i++}).${targetFile.ext}`) || ''
      }
      // If user cancel to prompt
      if (!newFileName) {
        toast(`Cancel to move file, ${targetFile.name}`, {
          type: 'warning'
        })
        return ''
      }
      newPath = `${directory.path}/${newFileName}`
    }

    return newPath
  }

  const copyFiles = async () => {
    if (movesSlideIndex === -1) {
      checkedTargetFiles.map(async (checkedTargetFileEl) => {
        const newPath = await checkAndPromptFileName(checkedTargetFileEl)
        // Copy file to new path
        await copyFile(checkedTargetFileEl.path, newPath)
        dispatch(removeTargetFile(checkedTargetFileEl.path))
      })
    } else {
      const targetFileByIndex = targetFiles[movesSlideIndex]
      const newPath = await checkAndPromptFileName(targetFileByIndex)
      // Copy file to new path
      await copyFile(targetFileByIndex.path, newPath)
      dispatch(removeTargetFile(targetFileByIndex.path))
      let newSlideIndex = 0
      if (targetFiles.length === 1) newSlideIndex = -1
      else if(movesSlideIndex !== 0) newSlideIndex = movesSlideIndex - 1
      dispatch(setMovesSlideIndex(newSlideIndex))
    }
  }

  const moveFiles = async () => {
    if (movesSlideIndex === -1) {
      checkedTargetFiles.map(async (checkedTargetFileEl) => {
        const newPath = await checkAndPromptFileName(checkedTargetFileEl)
        // Move file to new path
        await renameFile(checkedTargetFileEl.path, newPath)
        dispatch(removeTargetFile(checkedTargetFileEl.path))
      })
    } else {
      const targetFileByIndex = targetFiles[movesSlideIndex]
      const newPath = await checkAndPromptFileName(targetFileByIndex)
      // Move file to new path
      await renameFile(targetFileByIndex.path, newPath)
      dispatch(removeTargetFile(targetFileByIndex.path))
      let newSlideIndex = 0
      if (targetFiles.length === 1) newSlideIndex = -1
      else if(movesSlideIndex !== 0) newSlideIndex = movesSlideIndex - 1
      dispatch(setMovesSlideIndex(newSlideIndex))
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
      <Tooltip label="Remove directory">
        <IconButton
          variant="solid"
          size="xs"
          className="rounded-full absolute -top-2 -right-2"
          onClick={handleRemove} aria-label="remove"
        >
          <AiOutlineClose className="text-md" />
        </IconButton>
      </Tooltip>
      <CardBody>
        <div className="space-y-2">
          <Flex alignItems="center">
            <div className="w-3/12">Name:</div>
            <div>{directoryName}</div>
          </Flex>
          <Flex alignItems="center">
            <div className="w-3/12">Path:</div>
            <div className="break-all">{directory.path}</div>
          </Flex>
        </div>
        {directory.kbd ? (
          <div className="flex">
            {directory.kbd.map((kbdEl) => (
              <div key={kbdEl} className="kbd">
                {kbdEl}
              </div>
            ))}
          </div>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default MovesDirectoryCard
