import { useDispatch, useSelector } from 'react-redux'
import { open } from '@tauri-apps/api/dialog'
import { AiOutlineFolderAdd, AiOutlineSetting } from 'react-icons/ai'
import { RootState } from '@renderer/stores'
import { addMoveDirectory, removeMoveDirectory } from '@renderer/stores/slices/moves'
import { MoveDirectory } from '@renderer/types/models/moveDirectory'
import MovesDirectorySettingModal from '@renderer/components/moves/DirectorySettingDialog'
import MovesDirectoryCard from '@renderer/components/moves/DirectoryCard'
import { Card, CardBody, IconButton, Tooltip, Flex, Spacer, List, Heading, Box } from '@chakra-ui/react'

function MovesRight() {
  const directories = useSelector((state: RootState) => state.moves.moveDirectories)
  const dispatch = useDispatch()

  const handleAddDir = async () => {
    const directoryPaths = await open({
      title: 'Select Directory',
      directory: true,
      multiple: true,
    })
    if (directoryPaths && directoryPaths.length) {
      (directoryPaths as string[]).map((directoryPathEl) => {
        const foundIndex = directories.findIndex((directoryEl) => directoryEl.path === directoryPathEl)
        if (foundIndex !== -1) {
          alert('Same directory path already exists')
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
              <Heading size="md">Directories</Heading>
              <Spacer />
              <Tooltip label="Add directory">
                <IconButton
                  onClick={handleAddDir}
                  variant="ghost"
                  aria-label="Add directory"
                  icon={<AiOutlineFolderAdd className="text-2xl" />}
                />
              </Tooltip>
              <MovesDirectorySettingModal>
                <Tooltip label="Open setting" placement='left'>
                  <IconButton
                    variant="ghost"
                    aria-label="Open setting"
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </MovesDirectorySettingModal>
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
