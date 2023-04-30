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
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { useTranslation } from 'react-i18next'

function DeletesTypeCard() {
  const { t } = useTranslation()
  const validationSchema = z.object({
    type: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
      // Not empty
      .min(1, {
        message: capitalizeFirstLetter(t('texts.validations.fileName')),
      }),
  })
  type ValidationSchema = z.infer<typeof validationSchema>

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
        toast(capitalizeFirstLetter(t('texts.alerts.noTargetDirectoryWarning')), {
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
        toast(capitalizeFirstLetter(t('pages.deletes.texts.alerts.noFileBytWarning', { standard: data.type })), {
          type: 'warning'
        })
        return
      }
      await deleteTargetFiles(filteredFiles)

      toast(capitalizeFirstLetter(t('pages.deletes.texts.alerts.deleteSuccess')), {
        type: 'success'
      })
      reset()
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('pages.deletes.texts.alerts.deleteError')), {
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
          <Heading size="md">{capitalizeFirstLetter(t('labels.type'))}</Heading>
        </Flex>
      </CardHeader>
      <form className="h-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="p-3">
          <FormControl>
            <FormLabel>{capitalizeFirstLetter(t('labels.type'))}</FormLabel>
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
            loadingText={capitalizeFirstLetter(t('labels.deleting'))}
          >
            {capitalizeFirstLetter(t('labels.delete'))}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default DeletesTypeCard
