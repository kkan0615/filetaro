import { open } from '@tauri-apps/api/dialog'
import { toast } from 'react-toastify'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import _ from 'lodash'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import {
  addSlideDirectory, removeSlideDirectory,
  removeSlideTargetFileByPath,
  setSlidesIndex,
  sortSlideDirectories
} from '@renderer/stores/slices/slides'
import { useState } from 'react'
import { MoveSorts, MoveSortType } from '@renderer/types/models/directory'
import { MoveDirectory } from '@renderer/types/models/move'
import { Box, Card, CardBody, Flex, Heading, IconButton, List, Select, Spacer, Tooltip } from '@chakra-ui/react'
import { AiOutlineFolderAdd, AiOutlineSetting } from 'react-icons/ai'
import MovesSettingModal from '@renderer/components/moves/SettingDialog'
import DirectoryCard from '@renderer/components/directories/Card'
import { NO_SLIDE_INDEX } from '@renderer/types/models/slide'
import { moveOrCopyFile } from '@renderer/utils/file'

function SlidesRight() {
  const { t } = useTranslation()
  const directories = useSelector((state: RootState) => state.slides.directories)
  const targetFiles = useSelector((state: RootState) => state.slides.targetFiles)
  const slideIndex = useSelector((state: RootState) => state.slides.slideIndex)
  const setting = useSelector((state: RootState) => state.slides.setting)
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
          addSlideDirectory({
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

      await asyncSort()
    }
  }

  const asyncSort = async () => {
    dispatch(sortSlideDirectories(sortOption))
  }

  const removeDirectory = (directory: MoveDirectory) => {
    dispatch(removeSlideDirectory(directory))
  }

  const handleClickDirectory = async (directory: MoveDirectory) => {
    try {
      if (slideIndex === NO_SLIDE_INDEX) {
        toast(capitalizeFirstLetter(t('pages.moves.texts.alerts.noSelectFileWarn')), {
          type: 'warning'
        })
        return
      }
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
        dispatch(setSlidesIndex(newSlideIndex))
        dispatch(removeSlideTargetFileByPath(targetFileByIndex.path))
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
    dispatch(sortSlideDirectories(newSort))
  }

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 shrink p-2">
        <Card className="p-0">
          <CardBody padding={0} className="p-2 py-1">
            <Flex alignItems="center">
              <Heading size="md">{capitalizeFirstLetter(t('pages.moves.labels.directories'))}</Heading>
              <Spacer />
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

export default SlidesRight
