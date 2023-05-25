import { useEffect, useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spacer,
  Button,
  ModalFooter,
  Box,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Checkbox, useBoolean
} from '@chakra-ui/react'
import {
  ApplicationSetting,
  DateFormatOptions,
  DateFormatType,
  DefaultTimeFormat,
  TimeFormatOptions,
  TimeFormatType
} from '@renderer/types/models/setting'
import { RootState } from '@renderer/stores'
import { setApplicationSetting } from '@renderer/stores/slices/application'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import SettingDialogProgram from '@renderer/components/Settings/Program'
import SettingDialogMenuItem from '@renderer/components/Settings/MenuItem'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'
interface Props {
  children: React.ReactElement
}

function SettingDialog({ children }: Props) {
  const { t } = useTranslation()
  const validationSchema = z.object({
    dateFormat: z.string({
      // Not empty
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
      // Not empty
      .min(1, {
        message: capitalizeFirstLetter(t('texts.validations.fileName')),
      }),
    isIncludeTime: z.boolean(),
    timeFormat: z.string().nullable(),
  })
  type ValidationSchema = z.infer<typeof validationSchema>


  const setting = useSelector((state: RootState) => state.applications.setting)
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useState(false)
  const [currMenu, setCurrMenu ] = useState(0)
  const [isShowTimeInput, setIsShowTimeInput] = useState(false)

  useEffect(() => {
    const isIncludeTime = getValues('isIncludeTime')
    if (isIncludeTime) {
      setValue('timeFormat', DefaultTimeFormat)
    } else {
      setValue('timeFormat', null)
    }
    setIsShowTimeInput(isIncludeTime)
  }, [watch('isIncludeTime')])

  useEffect(() => {
    if (isOpen) {
      setValue('dateFormat', setting.dateFormat)
      setValue('isIncludeTime', !!setting.timeFormat)
      setValue('timeFormat', setting.timeFormat || null)
    } else {
      reset()
    }
  }, [isOpen])

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsLoading(true)
      await settingStore.set(SettingStoreKey.ApplicationSetting, {
        dateFormat: data.dateFormat as DateFormatType,
        timeFormat: data.isIncludeTime ? data.timeFormat as TimeFormatType | null : null,
      } as ApplicationSetting)
      dispatch(setApplicationSetting({
        dateFormat: data.dateFormat as DateFormatType,
        timeFormat: data.isIncludeTime ? data.timeFormat as TimeFormatType | null : null,
      }))
      toast(capitalizeFirstLetter(t('texts.alerts.saveSettingSuccess')), {
        type: 'success'
      })
      // toggle on-off
      setIsOpen.toggle()
      // Reset state
      reset()
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('texts.alerts.saveSettingError')), {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div onClick={setIsOpen.toggle}>{children}</div>
      <Modal isOpen={isOpen} onClose={setIsOpen.toggle} isCentered>
        <ModalOverlay />
        <ModalContent height="80%" className="max-w-3xl">
          <Flex height="100%">
            <Box
              bgColor="gray.800"
              className="w-52 shrink py-4"
            >
              <Text className="px-4 mb-2 opacity-70">
                {capitalizeFirstLetter(t('labels.menu'))}
              </Text>
              <ul>
                <SettingDialogMenuItem active={currMenu === 0} onClick={() => setCurrMenu(0)}>
                  {capitalizeFirstLetter(t('components.settings.menus.general'))}
                </SettingDialogMenuItem>
                <SettingDialogMenuItem active={currMenu === 1} onClick={() => setCurrMenu(1)}>
                  {capitalizeFirstLetter(t('components.settings.menus.program'))}
                </SettingDialogMenuItem>
              </ul>
            </Box>
            <div className="grow">
              <ModalHeader>
                {capitalizeFirstLetter(t('labels.setting'))}
              </ModalHeader>
              <ModalCloseButton />
              {(() => {
                if (currMenu === 0) {
                  return (
                    <form onSubmit={handleSubmit(onSubmit)} className="text-left">
                      <ModalBody>
                        <div className="space-y-4">
                          <FormControl isInvalid={!!errors.dateFormat?.message}>
                            <FormLabel>{capitalizeFirstLetter(t('components.settings.labels.dateFormat'))}</FormLabel>
                            <Select
                              className="select select-bordered"
                              {...register('dateFormat')}
                            >
                              {DateFormatOptions.map(dateFormatOptionEl => (
                                <option
                                  value={dateFormatOptionEl.value}
                                  key={dateFormatOptionEl.value}
                                >
                                  {dateFormatOptionEl.value} ({dateFormatOptionEl.example})
                                </option>
                              ))}
                            </Select>
                            {errors.dateFormat?.message ?
                              <FormErrorMessage>{errors.dateFormat.message}</FormErrorMessage>
                              : null
                            }
                          </FormControl>
                          <Checkbox
                            className="mt-4"
                            size="lg"
                            iconColor="white"
                            colorScheme="primary"
                            {...register('isIncludeTime')}
                          >
                            <span>{capitalizeFirstLetter(t('components.settings.labels.timeFormat'))}</span>
                          </Checkbox>
                          {
                            isShowTimeInput &&
                              <FormControl isInvalid={!!errors.timeFormat?.message}>
                                <FormLabel>{capitalizeFirstLetter(t('components.settings.labels.includeTime'))}</FormLabel>
                                <Select
                                  className="select select-bordered"
                                  {...register('timeFormat')}
                                >
                                  {TimeFormatOptions.map(timeFormatOptionEl => (
                                    <option
                                      value={timeFormatOptionEl.value}
                                      key={timeFormatOptionEl.value}
                                    >
                                      {timeFormatOptionEl.value} ({timeFormatOptionEl.example})
                                    </option>
                                  ))}
                                </Select>
                                {errors.timeFormat?.message ?
                                  <FormErrorMessage>{errors.timeFormat.message}</FormErrorMessage>
                                  : null
                                }
                              </FormControl>
                          }
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Spacer />
                        <Button
                          color="white"
                          colorScheme="primary"
                          type="submit"
                          isLoading={isLoading}
                          loadingText={capitalizeFirstLetter(t('labels.saving'))}
                        >
                          {capitalizeFirstLetter(t('buttons.save'))}
                        </Button>
                      </ModalFooter>
                    </form>
                  )
                } else if(currMenu === 1) {
                  return (
                    <ModalBody>
                      <SettingDialogProgram />
                    </ModalBody>
                  )
                }
              })()}
            </div>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SettingDialog
