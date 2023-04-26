import {
  Card,
  CardBody,
  FormControl,
  FormLabel, IconButton, Input,
  InputGroup, InputRightElement,
  Tooltip
} from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { AiOutlineFolderOpen } from 'react-icons/ai'
import { open } from '@tauri-apps/api/dialog'
import { setOrganizeDirectoryPath } from '@renderer/stores/slices/organizes'
import { useEffect, useState } from 'react'

function DirectoryPathCard() {
  const dispatch = useDispatch()
  const [directoryPath, setDirectoryPath] = useState('')

  const selectDirectory = async () => {
    const directoryPath = await open({
      title: 'Select Directory',
      directory: true,
    })

    setDirectoryPath((directoryPath as string) || '')

  }
  useEffect(() => {
    dispatch(setOrganizeDirectoryPath(directoryPath))
  }, [directoryPath])

  return (
    <Card id="directory-path-card">
      <CardBody className="p-3">
        <FormControl>
          <FormLabel>Output path</FormLabel>
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
      </CardBody>
    </Card>
  )
}

export default DirectoryPathCard
