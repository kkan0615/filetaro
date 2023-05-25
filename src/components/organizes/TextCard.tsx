import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader, Collapse, Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, Input, Radio, RadioGroup,
  Spacer, Stack,
  Text, useBoolean,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { RootState } from '@renderer/stores'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'
import { removeOrganizeTargetFileByPath } from '@renderer/stores/slices/organizes'
import { moveOrCopyFile, overrideOrCreateDirectory } from '@renderer/utils/file'
import { TargetFile } from '@renderer/types/models/targetFile'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { exists } from '@tauri-apps/api/fs'

const AddMethods = ['included', 'prefix', 'suffix'] as const

function OrganizesTextCard() {
  const { t } = useTranslation()
  const validationSchema = z.object({
    text: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
      // Not empty
      .min(1, {
        message: capitalizeFirstLetter(t('texts.validations.fileName')),
      }),
    methodType: z.enum(AddMethods, {
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    }),
  })
  type ValidationSchema = z.infer<typeof validationSchema>

  const checkedTargetFiles = useSelector((state: RootState) => state.organizes.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const directoryPath = useSelector((state: RootState) => state.organizes.directoryPath)
  const setting = useSelector((state: RootState) => state.organizes.setting)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      methodType: 'included'
    }
  })

  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useState(false)

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
      // Check directory is existed
      if (!await exists(directoryPath)) {
        toast(capitalizeFirstLetter(t('texts.alerts.noExDirectoryError')), {
          type: 'error'
        })
        return
      }
      setIsLoading(true)

      // Filter the files by type
      let filteredFiles: TargetFile[] = []
      if (data.methodType === 'included') {
        filteredFiles = filterIncludedFiles(data.text)
      } else if (data.methodType === 'prefix') {
        filteredFiles = filterPrefixFiles(data.text)
      } else if (data.methodType === 'suffix') {
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
      if (fullDirectoryPath) {
        // Loop to move or copy file
        await Promise.all(filteredFiles.map(async (fileEl) => {
          const isDone = await moveOrCopyFile({
            file: fileEl,
            directoryPath: fullDirectoryPath,
            isAutoDuplicatedName: setting.isAutoDuplicatedName,
            isCopy: setting.isKeepOriginal,
          })
          if (isDone) {
            // Remove from slice
            dispatch(removeOrganizeTargetFileByPath(fileEl.path))
          }
        }))
      }
      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.organizeSuccess')), {
        type: 'success'
      })
      reset()
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.organizeError')), {
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
    return checkedTargetFiles.filter(checkedTargetFileEl => {
      const splitName = checkedTargetFileEl.name.split('.')
      splitName.pop()
      return splitName.join('').endsWith(text)
    })
  }

  return (
    <Card id="text-card">
      <CardHeader onClick={setIsOpen.toggle} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">{capitalizeFirstLetter(t('labels.text'))}</Heading>
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
                <FormLabel>{capitalizeFirstLetter(t('labels.text'))}</FormLabel>
                <Input
                  placeholder={capitalizeFirstLetter(t('placeholders.typeHere'))}
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
                            {capitalizeFirstLetter(t(`labels.${addMethodEl}`))}
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
          <CardFooter className="p-3">
            <Button
              width='100%'
              color="white"
              type="submit"
              colorScheme="primary"
              isLoading={isLoading}
              loadingText={capitalizeFirstLetter(t('labels.organizing'))}
            >
              {capitalizeFirstLetter(t('buttons.organize'))}
            </Button>
          </CardFooter>
        </form>
      </Collapse>
    </Card>
  )
}

export default OrganizesTextCard
