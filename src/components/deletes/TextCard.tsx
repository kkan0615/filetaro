import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Flex, FormControl, FormErrorMessage, FormLabel,
  Heading, Input, Radio, RadioGroup,
  Spacer, Stack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState } from '@renderer/stores'
import { z } from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TargetFile } from '@renderer/types/models/targetFile'
import { deleteTargetFiles, findAllFilesInDirectory } from '@renderer/utils/file'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { useTranslation } from 'react-i18next'

const AddMethods = ['included', 'prefix', 'suffix']

function DeletesTextCard() {
  const { t } = useTranslation()
  const validationSchema = z.object({
    text: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
      // Not empty
      .min(1, {
        message: capitalizeFirstLetter(t('texts.validations.fileName')),
      }),
    methodType: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    }),
  })
  type ValidationSchema = z.infer<typeof validationSchema>

  const directoryPath = useSelector((state: RootState) => state.deletes.directoryPath)
  const isRecursive = useSelector((state: RootState) => state.deletes.isRecursive)
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues:{
      methodType: 'included'
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

      // Filter the files by type
      let filteredFiles: TargetFile[] = []
      if (data.methodType === 'included') {
        filteredFiles = files.filter(fileEl => fileEl.name.includes(data.text))
      } else if (data.methodType === 'prefix') {
        filteredFiles = files.filter(fileEl => fileEl.name.startsWith(data.text))
      } else if (data.methodType === 'suffix') {
        filteredFiles = files.filter(fileEl => {
          const splitName = fileEl.name.split('.')
          splitName.pop()
          return splitName.join('').endsWith(data.text)
        })
      }
      if (!filteredFiles.length) {
        toast(capitalizeFirstLetter(t('pages.deletes.texts.alerts.noFileBytWarning', { standard: data.text })), {
          type: 'warning'
        })
        return
      }
      // Delete all files
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
    <Card id="text-card" width="100%">
      <CardHeader className="p-3">
        <Flex alignItems="center">
          <Heading size="md">{capitalizeFirstLetter(t('labels.text'))}</Heading>
          <Spacer />
        </Flex>
      </CardHeader>
      <form className="h-full flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="p-3">
          <div className="space-y-4">
            <FormControl isInvalid={!!errors.text?.message}>
              <FormLabel>{capitalizeFirstLetter(t('labels.text'))}</FormLabel>
              <Input
                placeholder="Type here"
                {...register('text')}
              />
              {errors.text?.message ?
                <FormErrorMessage>{errors.text.message}</FormErrorMessage>
                : null
              }
            </FormControl>
            <Controller
              name="methodType"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.text?.message}>
                  <FormLabel>{capitalizeFirstLetter(t('labels.method'))}</FormLabel>
                  <RadioGroup onChange={onChange} value={value}>
                    <Stack direction='row'>
                      {AddMethods.map(addMethodEl => (
                        <Radio
                          {...register('methodType')}
                          key={addMethodEl}
                          value={addMethodEl}
                        >
                          {addMethodEl}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                  {errors.methodType?.message ?
                    <FormErrorMessage>{errors.methodType?.message}</FormErrorMessage>
                    : null
                  }
                </FormControl>
              )}
            />
          </div>
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

export default DeletesTextCard
