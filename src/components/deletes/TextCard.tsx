import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Collapse, Flex, FormControl, FormErrorMessage, FormLabel,
  Heading, Input, Select,
  Spacer,
  Text
} from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState } from '@renderer/stores'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TargetFile, TargetFileTypes } from '@renderer/types/models/targetFile'
import { deleteTargetFiles, findAllFilesInDirectory } from '@renderer/utils/file'

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

function DeletesTextCard({ type }: Props) {
  const directoryPath = useSelector((state: RootState) => state.deletes.directoryPath)
  const isRecursive = useSelector((state: RootState) => state.deletes.isRecursive)
  const setting = useSelector((state: RootState) => state.deletes.setting)

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

  useEffect(() => {
    setIsOpen(setting.isDefaultOpenCard)
  }, [setting.isDefaultOpenCard])

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
      if (!directoryPath) {
        toast('Select target directory', {
          type: 'warning'
        })
        return
      }
      setIsLoading(true)
      const files = await findAllFilesInDirectory({
        directoryPath,
        isRecursive,
      })
      // Filter the files by type
      let filteredFiles: TargetFile[] = []
      if (type === 'included') {
        filteredFiles = files.filter(fileEl => fileEl.name.includes(data.text))
      } else if (type === 'prefix') {
        filteredFiles = files.filter(fileEl => fileEl.name.startsWith(data.text))
      } else if (type === 'suffix') {
        filteredFiles = files.filter(fileEl => fileEl.name.endsWith(data.text))
      }
      if (!filteredFiles.length) {
        toast(`No files by ${data.text} in directory`, {
          type: 'warning'
        })
        return
      }
      // Delete all files
      await deleteTargetFiles(filteredFiles)

      reset()
    } catch (e) {
      console.error(e)
      toast('Error to delete files', {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card width="100%">
      <CardHeader onClick={toggleOpen} className="p-3 cursor-pointer">
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
          </CardBody>
          <CardFooter className="p-3">
            <Button
              width='100%'
              color="white"
              type="submit"
              colorScheme="error"
              isLoading={isLoading}
              loadingText='Organizing...'
            >
              Delete
            </Button>
          </CardFooter>
        </form>
      </Collapse>
    </Card>
  )
}

export default DeletesTextCard
