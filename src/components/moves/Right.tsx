import { useDispatch, useSelector } from 'react-redux'
import { open } from '@tauri-apps/api/dialog'
import { AiOutlineFolderAdd, AiOutlineSetting } from 'react-icons/ai'
import { RootState } from '@renderer/stores'
import { addMoveDirectory, removeMoveDirectory } from '@renderer/stores/slices/moves'
import { MoveDirectory } from '@renderer/types/models/move'
import MovesSettingModal from '@renderer/components/moves/SettingDialog'
import MovesDirectoryCard from '@renderer/components/moves/DirectoryCard'
import { Card, CardBody, IconButton, Tooltip, Flex, Spacer, List, Heading, Box } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { useTranslation } from 'react-i18next'

function MovesRight() {
  const { t } = useTranslation()
  const directories = useSelector((state: RootState) => state.moves.moveDirectories)
  const dispatch = useDispatch()

  const addDirectories = async () => {
    const directoryPaths = await open({
      title: 'Select Directory',
      directory: true,
      multiple: true,
    })
    if (directoryPaths && directoryPaths.length) {
      (directoryPaths as string[]).map((directoryPathEl) => {
        const foundIndex = directories.findIndex((directoryEl) => directoryEl.path === directoryPathEl)
        if (foundIndex !== -1) {
          toast(capitalizeFirstLetter(t('texts.alerts.sameDirectoryWarning', { name: directories[foundIndex].path })), {
            type: 'warning'
          })
          return
        }

        dispatch(
          addMoveDirectory({
            path: directoryPathEl,
          })
        )
      })
    }
  }

  const removeDirectory = (directory: MoveDirectory) => {
    dispatch(removeMoveDirectory(directory))
  }

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 mb-2 shrink p-2">
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
      <Box className="grow h-1 overflow-y-auto px-4 py-2">
        <List spacing={4}>
          {directories.map((dirEl) => (
            <MovesDirectoryCard key={dirEl.path} directory={dirEl} onRemove={removeDirectory} />
          ))}
        </List>
      </Box>
    </div>
  )
}

export default MovesRight
