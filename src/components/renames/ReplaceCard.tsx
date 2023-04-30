import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
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
  CardHeader, Checkbox,
  Collapse,
  Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, Input,
  Spacer,
  Text
} from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function RenamesReplaceCard() {
  const { t } = useTranslation()

  const validationSchema = z.object({
    targetStr: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
      // Not empty
      .min(1, {
        message: capitalizeFirstLetter(t('texts.validations.required')),
      }),
    replaceStr: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    }).refine(checkSpecialCharsInName, {
      message: capitalizeFirstLetter(t('texts.validations.fileName')),
    }),
    isReplaceAll: z.boolean({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
  })
  type ValidationSchema = z.infer<typeof validationSchema>

  const checkedTargetFiles = useSelector((state: RootState) => state.renames.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.renames.setting)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      isReplaceAll: true,
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsOpen(setting.isDefaultOpenCard)
  }, [setting.isDefaultOpenCard])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

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
        let replacedFileName = ''
        // Replace all text
        if (data.isReplaceAll) {
          replacedFileName = checkedTargetFileEl.name.replaceAll(data.targetStr, data.replaceStr)
        } else {
          // Replace first text
          replacedFileName = checkedTargetFileEl.name.replace(data.targetStr, data.replaceStr)
        }

        const { newFileNameWithPath, newFileName } = await renameOrCopyTargetFile({
          file: checkedTargetFileEl,
          newFileName: replacedFileName,
          isAutoDuplicatedName: setting.isAutoDuplicatedName,
          isKeepOriginal: setting.isKeepOriginal,
        })

        dispatch(updateRenameTargetFile({
          path: checkedTargetFileEl.path,
          newData: {
            ...checkedTargetFileEl,
            path: newFileNameWithPath,
            name: newFileName,
          }
        }))
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
    <Card id="replace-card">
      <CardHeader onClick={toggleOpen} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">{capitalizeFirstLetter(t('pages.renames.labels.replace'))}</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="p-3 space-y-4">
            <FormControl isInvalid={!!errors.targetStr?.message}>
              <FormLabel>{capitalizeFirstLetter(t('pages.renames.labels.targetText'))}</FormLabel>
              <Input
                placeholder="Type text"
                {...register('targetStr')}
              />
              {errors.replaceStr?.message ?
                <FormErrorMessage>{errors.targetStr?.message}</FormErrorMessage>
                : null
              }
            </FormControl>
            <FormControl isInvalid={!!errors.replaceStr?.message}>
              <FormLabel>{capitalizeFirstLetter(t('pages.renames.labels.replaceText'))}</FormLabel>
              <Input
                placeholder="Type text"
                {...register('replaceStr')}
              />
              {errors.replaceStr?.message ?
                <FormErrorMessage>{errors.replaceStr?.message}</FormErrorMessage>
                : null
              }
            </FormControl>
            <Checkbox
              size="lg"
              iconColor="white"
              colorScheme="primary"
              type="checkbox"
              {...register('isReplaceAll')}
            >
              <span>{capitalizeFirstLetter(t('pages.renames.labels.replaceAllText'))}</span>
            </Checkbox>
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

export default RenamesReplaceCard
