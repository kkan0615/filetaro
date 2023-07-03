
import { z } from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { renameOrCopyTargetFile } from '@renderer/utils/file'
import { updateRenameTargetFile } from '@renderer/stores/slices/renames'
import { checkSpecialCharsInName } from '@renderer/utils/validation'
import {
  Button,
  Card,
  CardBody, CardFooter,
  CardHeader,
  Collapse,
  Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, Input, Radio, RadioGroup,
  Spacer, Stack,
  Text, useBoolean,
} from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

const AddMethods = ['prefix', 'suffix']

function RenamesTextCard() {
  const { t } = useTranslation()
  const validationSchema = z.object({
    text: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    }).refine(checkSpecialCharsInName, {
      message: capitalizeFirstLetter(t('texts.validations.fileName')),
    }),
    methodType: z.enum({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    }),
  })
  type ValidationSchema = z.infer<typeof validationSchema>

  const checkedTargetFiles = useSelector((state: RootState) => state.renames.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.renames.setting)
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
      methodType: 'prefix'
    }
  })

  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (setting.isDefaultOpenCard) setIsOpen.toggle()
  }, [setting.isDefaultOpenCard])

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      if (!checkedTargetFiles.length) {
        toast(capitalizeFirstLetter(t('texts.alerts.noSelectedFileWarning')), {
          type: 'warning'
        })
        return
      }
      setIsLoading(true)

      await Promise.all(checkedTargetFiles.map(async (checkedTargetFileEl) => {
        // File name by type
        let tempFileName = ''
        if(data.methodType === 'prefix') {
          tempFileName = `${data.text}${checkedTargetFileEl.name}`
        } else {
          const splitName = checkedTargetFileEl.name.split('.')
          const ext = splitName.pop()
          tempFileName = `${splitName.join('')}${data.text}.${ext}`
        }
        const { newPath, newFileName } = await renameOrCopyTargetFile({
          file: checkedTargetFileEl,
          newFileName: tempFileName,
          isAutoDuplicatedName: setting.isAutoDuplicatedName,
          isKeepOriginal: setting.isKeepOriginal,
        })

        if (newPath && newFileName) {
          dispatch(updateRenameTargetFile({
            path: checkedTargetFileEl.path,
            newData: {
              ...checkedTargetFileEl,
              path: newPath,
              name: newFileName,
            }
          }))
        }
      }))

      toast(capitalizeFirstLetter(t('pages.renames.texts.alerts.renameSuccess')), {
        type: 'success'
      })
      reset()
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('pages.renames.texts.alerts.renameError')), {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <Card id="add-card">
      <CardHeader onClick={setIsOpen.toggle} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">{capitalizeFirstLetter(t('pages.renames.labels.add'))}</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="p-3 space-y-4">
            <FormControl isInvalid={!!errors.text?.message}>
              <FormLabel>{capitalizeFirstLetter(t('labels.text'))}</FormLabel>
              <Input
                placeholder={capitalizeFirstLetter(t('placeholders.typeHere'))}
                {...register('text')}
              />
              {errors.text?.message ?
                <FormErrorMessage>{errors.text?.message}</FormErrorMessage>
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
          </CardBody>
          <CardFooter className="p-3">
            <Button
              width='100%'
              color="white"
              colorScheme="primary"
              type="submit"
              isLoading={isLoading}
              loadingText={capitalizeFirstLetter(t('labels.submitting'))}
            >
              {capitalizeFirstLetter(t('buttons.submit'))}
            </Button>
          </CardFooter>
        </form>
      </Collapse>
    </Card>
  )
}

export default RenamesTextCard
