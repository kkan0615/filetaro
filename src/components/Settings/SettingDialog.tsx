import { AiOutlineClose, AiOutlineFolderOpen } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import {
  ApplicationSetting,
  DateFormatOptions,
  DateFormatType,
  DefaultTimeFormat,
  TimeFormatOptions,
  TimeFormatType
} from '@renderer/types/models/setting'
import { AiOutlineQuestionCircle } from 'react-icons/all'
import { getVersion } from '@tauri-apps/api/app'
import {
  checkUpdate,
  installUpdate,
  onUpdaterEvent,
} from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { ask } from '@tauri-apps/api/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { setApplicationSetting } from '@renderer/stores/slices/application'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import SettingDialogVersion from '@renderer/components/Settings/Version'
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
  InputGroup,
  Input,
  InputRightElement,
  Tooltip,
  IconButton, FormErrorMessage, Select, Checkbox
} from '@chakra-ui/react'

const validationSchema = z.object({
  dateFormat: z.string({
    // Not empty
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field'
    }),
  isIncludeTime: z.boolean(),
  timeFormat: z.string().nullable(),
})
type ValidationSchema = z.infer<typeof validationSchema>

interface Props {
  children: React.ReactElement
}

function SettingDialog({ children }: Props) {
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
  const [isOpen, setIsOpen] = useState(false)
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

  const toggleOpen = () => {
    if (!isOpen) {
      setValue('dateFormat', setting.dateFormat)
      setValue('isIncludeTime', !!setting.timeFormat)
      setValue('timeFormat', setting.timeFormat || null)
    } else {
      reset()
    }
    setIsOpen((prev) => !prev)
  }

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
      toast('Success to save setting', {
        type: 'success'
      })
      // toggle on-off
      toggleOpen()
      // Reset state
      reset()
    } catch (e) {
      console.error(e)
      toast('Error to load files', {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div onClick={toggleOpen}>{children}</div>
      <Modal isOpen={isOpen} onClose={toggleOpen} isCentered>
        <ModalOverlay />
        <ModalContent height="80%" className="max-w-3xl">
          <Flex height="100%">
            <Box
              bgColor="gray.800"
              className="w-52 shrink py-4"
            >
              <Text className="px-4 mb-2 opacity-70">
                Menus
              </Text>
              <ul>
                <li
                  onClick={() => setCurrMenu(0)}
                  className={`py-2 px-4 cursor-pointer text-white hover:bg-primary ${currMenu === 0 ? 'bg-primary text-white' : ''}`}
                >
                  General
                </li>
                <li
                  onClick={() => setCurrMenu(1)}
                  className={`py-2 px-4 cursor-pointer text-white hover:bg-primary ${currMenu === 1 ? 'bg-primary text-white' : ''}`}
                >
                  Version
                </li>
              </ul>
            </Box>
            <div className="grow">
              <ModalHeader>
                Setting
              </ModalHeader>
              <ModalCloseButton />
              {(() => {
                if (currMenu === 0) {
                  return (
                    <form onSubmit={handleSubmit(onSubmit)} className="text-left">
                      <ModalBody>
                        <div className="space-y-4">
                          <FormControl isInvalid={!!errors.dateFormat?.message}>
                            <FormLabel>Date format</FormLabel>
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
                            <span>Include time</span>
                          </Checkbox>
                          {
                            isShowTimeInput &&
                              <FormControl isInvalid={!!errors.timeFormat?.message}>
                                <FormLabel>Time format</FormLabel>
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
                          loadingText='Submitting'
                        >
                        Save
                        </Button>
                      </ModalFooter>
                    </form>
                  )
                } else if(currMenu === 1) {
                  return (
                    <ModalBody>
                      <SettingDialogVersion />
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
