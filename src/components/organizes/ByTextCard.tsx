import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Collapse, Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, Input,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RootState } from '@renderer/stores'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'
import { removeOrganizeTargetFileByPath } from '@renderer/stores/slices/organizes'
import { moveOrCopyFile, overrideOrCreateDirectory } from '@renderer/utils/file'
import { TargetFile } from '@renderer/types/models/targetFile'

interface Props {
  type: 'included' | 'prefix' | 'suffix'
}

const validationSchema = z.object({
  text: z.string({
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field',
    }),
})
type ValidationSchema = z.infer<typeof validationSchema>

function ByTextCard({ type } : Props) {
  const checkedTargetFiles = useSelector((state: RootState) => state.organizes.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const directoryPath = useSelector((state: RootState) => state.organizes.directoryPath)
  const setting = useSelector((state: RootState) => state.organizes.setting)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Title of card
   */
  const title = useMemo(() => {
    if (type === 'included') {
      return 'Included text type'
    } else if (type === 'prefix') {
      return 'Prefix text type'
    } else if (type === 'suffix') {
      return 'Suffix text type'
    }

    return ''
  }, [type])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      if (!checkedTargetFiles.length) {
        toast('Select any files', {
          type: 'warning'
        })
        return
      }

      if (!directoryPath) {
        toast('Select output directory', {
          type: 'warning'
        })
        return
      }
      setIsLoading(true)

      // Filter the files by type
      let filteredFiles: TargetFile[] = []
      if (type === 'included') {
        filteredFiles = filterIncludedFiles(data.text)
      } else if (type === 'prefix') {
        filteredFiles = filterPrefixFiles(data.text)
      } else if (type === 'suffix') {
        filteredFiles = filterSuffixFiles(data.text)
      }
      // If no files including file name, return
      if (!filteredFiles.length) {
        toast(`No files with the ${data.text}`, {
          type: 'warning'
        })
        return
      }
      // path + text
      let fullDirectoryPath = directoryPath + '\\' + data.text
      // Create directory
      fullDirectoryPath = await overrideOrCreateDirectory({
        directoryPath: fullDirectoryPath,
        isOverride: setting.isOverrideDirectory,
        isAutoDuplicatedName: setting.isAutoDuplicatedName,
      })
      // Loop to move or copy file
      await Promise.all(filteredFiles.map(async (fileEl) => {
        await moveOrCopyFile({
          file: fileEl,
          directoryPath: fullDirectoryPath,
          isAutoDuplicatedName: setting.isAutoDuplicatedName,
          isCopy: setting.isKeepOriginal,
        })
        // Remove from slice
        dispatch(removeOrganizeTargetFileByPath(fileEl.path))
      }))
      toast('Success to rename files', {
        type: 'success'
      })
      reset()
    } catch (e) {
      console.error(e)
      toast('Error to organize files', {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterIncludedFiles = (text: string) => {
    return checkedTargetFiles.filter(checkedTargetFileEl => checkedTargetFileEl.name.includes(text))

  }
  const filterPrefixFiles = (text: string) => {
    return checkedTargetFiles.filter(checkedTargetFileEl => checkedTargetFileEl.name.startsWith(text))
  }

  const filterSuffixFiles = (text: string) => {
    return checkedTargetFiles.filter(checkedTargetFileEl => checkedTargetFileEl.name.endsWith(text))
  }

  return (
    <Card>
      <CardHeader onClick={toggleOpen} className="p-3">
        <Flex alignItems="center">
          <Heading size="md">{title}</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="p-3">
            <div className="space-y-4">
              <FormControl isInvalid={!!errors.text?.message}>
                <FormLabel>Text</FormLabel>
                <Input
                  placeholder="Type here"
                  {...register('text')}
                />
                {errors.text?.message ?
                  <FormErrorMessage>{errors.text.message}</FormErrorMessage>
                  : null
                }
              </FormControl>
            </div>
          </CardBody>
          <CardFooter className="p-3">
            <Button
              width='100%'
              color="white"
              type="submit"
              colorScheme="primary"
              isLoading={isLoading}
              loadingText='Organizing...'
            >
              Organize
            </Button>
          </CardFooter>
        </form>
      </Collapse>
    </Card>
  )
}

export default ByTextCard
