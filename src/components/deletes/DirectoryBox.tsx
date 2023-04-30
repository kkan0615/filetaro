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
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { useTranslation } from 'react-i18next'

function DeletesDirectoryBox() {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [directoryPath, setDirectoryPath] = useState('')
  const [isRecursive, setIsRecursive] = useState(false)

  const selectDirectory = async () => {
    const directoryPath = await open({
      title: capitalizeFirstLetter(t('labels.selectDirectory')),
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
    <Box id="directory-box" className="w-full">
      <List spacing={4}>
        <FormControl>
          <FormLabel>{capitalizeFirstLetter(t('labels.selectDirectoryPath'))}</FormLabel>
          <InputGroup size="lg">
            <Input
              placeholder="Type here"
              value={directoryPath}
              onChange={(e) => setDirectoryPath(e.target.value)}
            />
            <InputRightElement>
              <Tooltip placement="auto" label={capitalizeFirstLetter(t('labels.selectDirectory'))}>
                <IconButton
                  variant="ghost"
                  onClick={selectDirectory}
                  aria-label={capitalizeFirstLetter(t('labels.selectDirectory'))}
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
          <Tooltip label={capitalizeFirstLetter(t('pages.deletes.labels.recursive'))} placement='auto'>
            <span>{capitalizeFirstLetter(t('labels.recursive'))}</span>
          </Tooltip>
        </Checkbox>
      </List>
    </Box>
  )
}

export default DeletesDirectoryBox
