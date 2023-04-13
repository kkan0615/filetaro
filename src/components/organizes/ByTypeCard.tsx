import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, IconButton, Input,
  InputGroup, InputRightElement,
  Text, Tooltip
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { toast } from 'react-toastify'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AiOutlineFolderOpen } from 'react-icons/ai'
import { open } from '@tauri-apps/api/dialog'
import { TargetFiles } from '@renderer/types/models/targetFiles'

const validationSchema = z.object({
  directoryPath: z.string({
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field',
    }),
})
type ValidationSchema = z.infer<typeof validationSchema>

function ByTypeCard() {
  const checkedTargetFiles = useSelector((state: RootState) => state.organizes.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.organizes.setting)
  const dispatch = useDispatch()
  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const selectDirectory = async () => {
    const directoryPath = await open({
      title: 'Select Directory',
      directory: true,
    })
    setValue('directoryPath', (directoryPath as string) || '')
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      if (!checkedTargetFiles.length) {
        toast('Select any files', {
          type: 'warning'
        })
        return
      }
      setIsLoading(true)

      // File type map
      const fileTypeMap: Record<string, TargetFiles[]> = {}
      checkedTargetFiles.map(checkedTargetFileEl => {
        if (!fileTypeMap[checkedTargetFileEl.type]) fileTypeMap[checkedTargetFileEl.type] = []
        fileTypeMap[checkedTargetFileEl.type].push(checkedTargetFileEl)
      })

      console.log(fileTypeMap)

      // @TODO: Add logic to create folder
      // @TODO: Add logic to move files to folder


      toast('Success to rename files', {
        type: 'success'
      })
    } catch (e) {
      console.error(e)
      toast('Error to rename files', {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="py-3">
          <Heading size='md'>By File type</Heading>
        </CardHeader>
        <CardBody className="py-0">
          <div className="space-y-4">
            <FormControl isInvalid={!!errors.directoryPath?.message}>
              <FormLabel>Select or type directory path</FormLabel>
              <InputGroup>
                <Input
                  placeholder="Type here"
                  {...register('directoryPath')}
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
              {errors.directoryPath?.message ?
                <FormErrorMessage>{errors.directoryPath.message}</FormErrorMessage>
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
    </Card>
  )
}

export default ByTypeCard
