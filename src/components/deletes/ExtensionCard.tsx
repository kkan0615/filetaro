import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Flex, FormControl, FormErrorMessage, FormLabel,
  Heading, Input,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState } from '@renderer/stores'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { deleteTargetFiles, findAllFilesInDirectory } from '@renderer/utils/file'

const validationSchema = z.object({
  ext: z.string({
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field',
    }),
})
type ValidationSchema = z.infer<typeof validationSchema>

function DeletesExtensionCard() {
  const directoryPath = useSelector((state: RootState) => state.deletes.directoryPath)
  const isRecursive = useSelector((state: RootState) => state.deletes.isRecursive)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
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
      const filteredFiles = files.filter((fileEl) => fileEl.ext === data.ext)
      if (!filteredFiles.length) {
        toast(`No files by ${data.ext} in directory`, {
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
    <Card width="100%">
      <CardHeader className="p-3">
        <Flex alignItems="center">
          <Heading size="md">File Extension</Heading>
        </Flex>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="p-3">
          <FormControl>
            <FormControl isInvalid={!!errors.ext?.message}>
              <FormLabel>Extension</FormLabel>
              <Input
                placeholder="Extension without ."
                {...register('ext')}
              />
              {errors.ext?.message ?
                <FormErrorMessage>{errors.ext.message}</FormErrorMessage>
                : null
              }
            </FormControl>
          </FormControl>
        </CardBody>
        <CardFooter className="p-3">
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

export default DeletesExtensionCard
