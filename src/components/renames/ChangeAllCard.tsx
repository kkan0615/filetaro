
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
  CardHeader,
  Collapse,
  Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, Input,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function RenamesChangeAllTextCard() {
  const { t } = useTranslation()
  const validationSchema = z.object({
    text: z.string({
      required_error: 'Required field',
    }).refine(checkSpecialCharsInName, {
      message: '\ / : * < > | are not allowed',
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
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
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
      for (let i = 0; i < checkedTargetFiles.length; i++) {
        const checkedTargetFileEl = checkedTargetFiles[i]
        const splitName = checkedTargetFileEl.name.split('.')
        const ext = splitName.pop()
        const tempFileName = `${data.text}.${ext}`

        const { newFileNameWithPath, newFileName } = await renameOrCopyTargetFile({
          file: checkedTargetFileEl,
          newFileName: tempFileName,
          isAutoDuplicatedName: true,
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
      }
      // await Promise.all(checkedTargetFiles.map(async (checkedTargetFileEl) => {
      // }))

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
      <CardHeader onClick={toggleOpen} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">Change all</Heading>
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
              <FormLabel>Text</FormLabel>
              <Input
                placeholder="Type text"
                {...register('text')}
              />
              {errors.text?.message ?
                <FormErrorMessage>{errors.text?.message}</FormErrorMessage>
                : null
              }
            </FormControl>
          </CardBody>
          <CardFooter className="p-3">
            <Button
              width='100%'
              color="white"
              colorScheme="primary"
              type="submit"
              isLoading={isLoading}
              loadingText='Submitting'
            >
              Submit
            </Button>
          </CardFooter>
        </form>
      </Collapse>
    </Card>
  )
}

export default RenamesChangeAllTextCard
