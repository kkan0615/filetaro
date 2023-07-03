import { useDispatch, useSelector } from 'react-redux'
import { open } from '@tauri-apps/api/dialog'
import { AiOutlineFolderAdd, AiOutlineSetting } from 'react-icons/ai'
import { RootState } from '@renderer/stores'
import {
  addMoveDirectory,
  removeMoveDirectory,
  removeTargetFile, setMovesSlideIndex,
  sortMoveDirectories
} from '@renderer/stores/slices/moves'
import { MoveDirectory } from '@renderer/types/models/move'
import MovesSettingModal from '@renderer/components/moves/SettingDialog'
import DirectoryCard from '@renderer/components/directories/Card'
import { Card, CardBody, IconButton, Tooltip, Flex, Spacer, List, Heading, Box, Select } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import dayjs from 'dayjs'
import { useState } from 'react'
import { MoveSorts, MoveSortType } from '@renderer/types/models/directory'
import { NO_SLIDE_INDEX } from '@renderer/types/models/slide'
import { moveOrCopyFile } from '@renderer/utils/file'
import MovesHelp from '@renderer/components/moves/Help'

function MovesRight() {
  const { t } = useTranslation()
  const directories = useSelector((state: RootState) => state.moves.moveDirectories)
  const targetFiles = useSelector((state: RootState) => state.moves.targetFiles)
  const slideIndex = useSelector((state: RootState) => state.moves.movesSlideIndex)
  const checkedTargetFiles = useSelector((state: RootState) => state.moves.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.moves.setting)
  const dispatch = useDispatch()

  const [sortOption, setSortOption] = useState<MoveSortType>('+createdAt')

  const addDirectories = async () => {
    const directoryPaths = await open({
      title: 'Select Directory',
      directory: true,
      multiple: true,
    })
    if (directoryPaths && directoryPaths.length) {
      let metaKey = 'control'
      let num = 1
      let isLast = false
      const kbdList = directories
        .filter(directoryEl => !!directoryEl.kbd)
        .map(directoryEl => directoryEl.kbd)

      for (const directoryPathEl of directoryPaths) {
        const foundIndex = directories.findIndex((directoryEl) => directoryEl.path === directoryPathEl)
        if (foundIndex !== -1) {
          toast(capitalizeFirstLetter(t('texts.alerts.sameDirectoryWarning', { name: directories[foundIndex].path })), {
            type: 'warning'
          })
          return
        }

        /** Check existed */
        const isEx = () => {
          return kbdList.findIndex(kbdEl => _.isEqual(kbdEl, [metaKey, (num % 10).toString()])) >= 0
        }
        while(isEx()) {
          if (num === 10) {
            if (metaKey === 'control') metaKey = 'alt'
            else if (metaKey === 'alt') metaKey = 'shift'
            else if (metaKey === 'shift') isLast = true

            num = 0
          }
          ++num
        }
        dispatch(
          addMoveDirectory({
            path: directoryPathEl,
            kbd: isLast ? undefined : [metaKey, (num % 10).toString()],
            createdAt: dayjs().toISOString(),
          })
        )

        if (!isLast) {
          if (num === 10) {
            if (metaKey === 'ctrl') metaKey = 'alt'
            else if (metaKey === 'alt') metaKey = 'shift'
            else if (metaKey === 'shift') isLast = true

            num = 0
          }
          ++num
        }
      }

      // await Promise.all((directoryPaths as string[]).map(async (directoryPathEl) => {
      //   const foundIndex = directories.findIndex((directoryEl) => directoryEl.path === directoryPathEl)
      //   if (foundIndex !== -1) {
      //     toast(capitalizeFirstLetter(t('texts.alerts.sameDirectoryWarning', { name: directories[foundIndex].path })), {
      //       type: 'warning'
      //     })
      //     return
      //   }
      //
      //   /** Check existed */
      //   const isEx = () => {
      //     return kbdList.findIndex(kbdEl => _.isEqual(kbdEl, [metaKey, (num % 10).toString()])) >= 0
      //   }
      //   while(isEx()) {
      //     if (num === 10) {
      //       if (metaKey === 'control') metaKey = 'alt'
      //       else if (metaKey === 'alt') metaKey = 'shift'
      //       else if (metaKey === 'shift') isLast = true
      //
      //       num = 0
      //     }
      //     ++num
      //   }
      //   dispatch(
      //     addMoveDirectory({
      //       path: directoryPathEl,
      //       kbd: isLast ? undefined : [metaKey, (num % 10).toString()],
      //       createdAt: dayjs().toISOString(),
      //     })
      //   )
      //
      //   if (!isLast) {
      //     if (num === 10) {
      //       if (metaKey === 'ctrl') metaKey = 'alt'
      //       else if (metaKey === 'alt') metaKey = 'shift'
      //       else if (metaKey === 'shift') isLast = true
      //
      //       num = 0
      //     }
      //     ++num
      //   }
      // }))

      await asyncSort()
    }
  }

  const asyncSort = async () => {
    dispatch(sortMoveDirectories(sortOption))
  }

  const removeDirectory = (directory: MoveDirectory) => {
    dispatch(removeMoveDirectory(directory))
  }

  const handleClickDirectory = async (directory: MoveDirectory) => {
    try {
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

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = event.target.value as MoveSortType
    setSortOption(newSort)
    dispatch(sortMoveDirectories(newSort))
  }

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 shrink p-2">
        <Card className="p-0">
          <CardBody padding={0} className="p-2 py-1">
            <Flex alignItems="center">
              <Heading size="md">{capitalizeFirstLetter(t('pages.moves.labels.directories'))}</Heading>
              <Spacer />
              <MovesHelp />
              <Tooltip label={capitalizeFirstLetter(t('tooltips.addDirectories'))}>
                <IconButton
                  id="add-directory-button"
                  onClick={addDirectories}
                  variant="ghost"
                  aria-label={capitalizeFirstLetter(t('tooltips.addDirectories'))}
                  icon={<AiOutlineFolderAdd className="text-2xl" />}
                />
              </Tooltip>
              <MovesSettingModal>
                <Tooltip label={capitalizeFirstLetter(t('tooltips.openSetting'))} placement='left'>
                  <IconButton
                    variant="ghost"
                    aria-label={capitalizeFirstLetter(t('tooltips.openSetting'))}
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </MovesSettingModal>
            </Flex>
          </CardBody>
        </Card>
      </div>
      <Flex className="p-2 py-1 mb-2">
        <Select
          value={sortOption}
          className="select select-bordered"
          onChange={handleSortChange}
        >
          {MoveSorts.map(sortOptionEl => (
            <option
              value={sortOptionEl}
              key={sortOptionEl}
            >
              {t(`labels.sorts.${sortOptionEl}`)}
            </option>
          ))}
        </Select>
      </Flex>
      <Box className="grow h-1 overflow-y-auto px-4 py-2">
        <List spacing={4}>
          {directories.map((dirEl) => (
            <DirectoryCard key={dirEl.path} directory={dirEl} onRemove={removeDirectory} onClick={handleClickDirectory} />
          ))}
        </List>
      </Box>
    </div>
  )
}

export default MovesRight
