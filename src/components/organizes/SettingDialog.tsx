import { useEffect, useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  Spacer, Checkbox, Tooltip
} from '@chakra-ui/react'
import { setOrganizeSetting } from '@renderer/stores/slices/organizes'
import { OrganizeSetting } from '@renderer/types/models/organize'

const validationSchema = z.object({
  isKeepOriginal: z.boolean(),
  isAutoDuplicatedName: z.boolean(),
  isOverrideDirectory: z.boolean(),
  isDefaultOpenCard: z.boolean(),
  isDefaultCheckedOnLoad: z.boolean(),
})
type ValidationSchema = z.infer<typeof validationSchema>

interface Props {
  children: React.ReactElement
}

function OrganizesSettingModal({ children }: Props) {
  const setting = useSelector((state: RootState) => state.organizes.setting)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setValue('isAutoDuplicatedName', setting.isAutoDuplicatedName)
    setValue('isOverrideDirectory', setting.isOverrideDirectory)
    setValue('isKeepOriginal', setting.isKeepOriginal)
    setValue('isDefaultOpenCard', setting.isDefaultOpenCard)
    setValue('isDefaultCheckedOnLoad', setting.isDefaultCheckedOnLoad)
  }, [isOpen])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsLoading(true)
      await settingStore.set(SettingStoreKey.OrganizeSetting, {
        ...setting,
        isAutoDuplicatedName: data.isAutoDuplicatedName,
        isKeepOriginal: data.isKeepOriginal,
        isOverrideDirectory: data.isOverrideDirectory,
        isDefaultOpenCard: data.isDefaultOpenCard,
        isDefaultCheckedOnLoad: data.isDefaultCheckedOnLoad,
      } as OrganizeSetting)

      dispatch(setOrganizeSetting({
        isAutoDuplicatedName: data.isAutoDuplicatedName,
        isKeepOriginal: data.isKeepOriginal,
        isOverrideDirectory: data.isOverrideDirectory,
        isDefaultOpenCard: data.isDefaultOpenCard,
        isDefaultCheckedOnLoad: data.isDefaultCheckedOnLoad,
      }))

      toast('Success to save setting', {
        type: 'success'
      })
      toggleOpen()
    } catch (e) {
      console.error(e)
      toast('Error to save setting', {
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
        <ModalContent>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              Setting
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="flex flex-col space-y-2">
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isKeepOriginal')}
                >
                  <Tooltip label="Keep original file before move" placement='auto'>
                    <span>Keep original</span>
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isOverrideDirectory')}
                >
                  <Tooltip label="Use existed directory if there are same directory name" placement='auto'>
                    <span>Use existed directory</span>
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isAutoDuplicatedName')}
                >
                  <Tooltip label="Automatically rename if there is same file name in directory" placement='auto'>
                    <span>Auto renaming for same file name</span>
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isDefaultOpenCard')}
                >
                  <Tooltip label="Open all cards default when you enter the page" placement='auto'>
                    <span>Open all cards</span>
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isDefaultCheckedOnLoad')}
                >
                  <Tooltip label="Check for loaded files automatically" placement='auto'>
                    <span>Check for loaded files</span>
                  </Tooltip>
                </Checkbox>
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
        </ModalContent>
      </Modal>
    </>
  )
}

export default OrganizesSettingModal
