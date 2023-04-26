import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Flex, FormControl, FormErrorMessage, FormLabel,
  Heading, Select,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState } from '@renderer/stores'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TargetFileTypes } from '@renderer/types/models/targetFile'
import { deleteTargetFiles, findAllFilesInDirectory } from '@renderer/utils/file'

const validationSchema = z.object({
  type: z.string({
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field',
    }),
})
type ValidationSchema = z.infer<typeof validationSchema>

function DeletesTypeCard() {
  const directoryPath = useSelector((state: RootState) => state.deletes.directoryPath)
  const isRecursive = useSelector((state: RootState) => state.deletes.isRecursive)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      type: 'image'
    }
  })

  const [isLoading, setIsLoading] = useState(false)

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
      const filteredFiles = files.filter((fileEl) => fileEl.type === data.type)
      if (!filteredFiles.length) {
        toast(`No files by ${data.type} type in directory`, {
          type: 'warning'
        })
        return
      }
      await deleteTargetFiles(filteredFiles)

      toast('Success to delete files', {
        type: 'success'
      })
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
    <Card id="type-card" width="100%">
      <CardHeader className="p-3">
        <Flex alignItems="center">
          <Heading size="md">File type</Heading>
        </Flex>
      </CardHeader>
      <form className="h-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="p-3">
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select
              isInvalid={!!errors.type?.message}
              {...register('type')}
            >
              {TargetFileTypes.map(targetFileTypeEl => (
                <option key={targetFileTypeEl} value={targetFileTypeEl}>{targetFileTypeEl}</option>
              ))}
            </Select>
            {errors.type?.message ?
              <FormErrorMessage>{errors.type.message}</FormErrorMessage>
              : null
            }
          </FormControl>
        </CardBody>
        <CardFooter className="p-3 mt-auto">
          <Button
            size="sm"
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
    </Card>
  )
}

export default DeletesTypeCard
