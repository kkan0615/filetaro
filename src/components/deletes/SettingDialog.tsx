import { useEffect, useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { settingStore } from '@renderer/stores/tauriStore'
import { SettingStoreKey } from '@renderer/types/store'
import { RenameSetting } from '@renderer/types/models/rename'
import { setRenameSetting } from '@renderer/stores/slices/renames'
import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  Spacer, Checkbox, Tooltip, useBoolean
} from '@chakra-ui/react'
import { DeleteSetting } from '@renderer/types/models/delete'
import { setDeleteSetting } from '@renderer/stores/slices/deletes'

const validationSchema = z.object({
  isDefaultRecursive: z.boolean(),
  isDefaultOpenCard: z.boolean(),
})
type ValidationSchema = z.infer<typeof validationSchema>

interface Props {
  children: React.ReactElement
}

function DeletesSettingModal({ children }: Props) {
  const setting = useSelector((state: RootState) => state.deletes.setting)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })
  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setValue('isDefaultRecursive', setting.isDefaultRecursive)
    setValue('isDefaultOpenCard', setting.isDefaultOpenCard)
  }, [isOpen])

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsLoading(true)
      const newSetting: DeleteSetting = {
        ...setting,
        isDefaultRecursive: data.isDefaultRecursive,
        isDefaultOpenCard: data.isDefaultOpenCard,
      }

      await settingStore.set(SettingStoreKey.DeleteSetting, newSetting)
      dispatch(setDeleteSetting(newSetting))

      toast('Success to save setting', {
        type: 'success'
      })
      setIsOpen.toggle()
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
      <div onClick={setIsOpen.toggle}>{children}</div>
      <Modal isOpen={isOpen} onClose={setIsOpen.toggle} isCentered>
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
                  {...register('isDefaultRecursive')}
                >
                  <Tooltip label="Keep original file before move" placement='auto'>
                    <span>Check recursive all box in default</span>
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

export default DeletesSettingModal
