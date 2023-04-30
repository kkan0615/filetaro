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
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { useTranslation } from 'react-i18next'

function DeletesExtensionCard() {
  const { t } = useTranslation()
  const validationSchema = z.object({
    ext: z.string({
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
      const filteredFiles = files.filter((fileEl) => fileEl.ext === data.ext)
      if (!filteredFiles.length) {
        toast(capitalizeFirstLetter(t('pages.deletes.texts.alerts.noFileBytWarning', { standard: data.ext })), {
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
    <Card id="extension-card" width="100%">
      <CardHeader className="p-3">
        <Flex alignItems="center">
          <Heading size="md">{capitalizeFirstLetter(t('labels.extension'))}</Heading>
        </Flex>
      </CardHeader>
      <form className="h-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="p-3">
          <FormControl>
            <FormControl isInvalid={!!errors.ext?.message}>
              <FormLabel>{capitalizeFirstLetter(t('labels.extension'))}</FormLabel>
              <Input
                placeholder={capitalizeFirstLetter(t('pages.deletes.placeholders.without'))}
                {...register('ext')}
              />
              {errors.ext?.message ?
                <FormErrorMessage>{errors.ext.message}</FormErrorMessage>
                : null
              }
            </FormControl>
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

export default DeletesExtensionCard
