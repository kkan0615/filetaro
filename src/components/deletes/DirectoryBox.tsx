import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  List,
  Tooltip
} from '@chakra-ui/react'
import { AiOutlineFolderOpen } from 'react-icons/ai'
import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { open } from '@tauri-apps/api/dialog'
import { setDeleteDirectoryPath, setDeleteIsRecursive } from '@renderer/stores/slices/deletes'

function DeletesDirectoryBox() {
  const dispatch = useDispatch()
  const [directoryPath, setDirectoryPath] = useState('')
  const [isRecursive, setIsRecursive] = useState(false)

  const selectDirectory = async () => {
    const directoryPath = await open({
      title: 'Select Directory',
      directory: true,
    })

    setDirectoryPath((directoryPath as string) || '')

  }
  useEffect(() => {
    dispatch(setDeleteDirectoryPath(directoryPath))
  }, [directoryPath])

  useEffect(() => {
    dispatch(setDeleteIsRecursive(isRecursive))
  }, [isRecursive])

  return (
    <Box className="w-full">
      <List spacing={4}>
        <FormControl>
          <FormLabel>Select or type directory path</FormLabel>
          <InputGroup>
            <Input
              placeholder="Type here"
              value={directoryPath}
              onChange={(e) => setDirectoryPath(e.target.value)}
            />
            <InputRightElement>
              <Tooltip placement="auto" label="select directory">
                <IconButton
                  variant="ghost"
                  onClick={selectDirectory}
                  aria-label="select directory"
                  icon={<AiOutlineFolderOpen className="text-2xl" />}
                >
                </IconButton>
              </Tooltip>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Checkbox
          size="lg"
          iconColor="white"
          colorScheme="primary"
          checked={isRecursive}
          onChange={() => setIsRecursive(prevState => !prevState)}
        >
          <Tooltip label="Check all files in directories in directories" placement='auto'>
            <span>Recursive</span>
          </Tooltip>
        </Checkbox>
      </List>
    </Box>
  )
}

export default DeletesDirectoryBox
