import { useEffect, useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { settingStore } from '@renderer/stores/tauriStore'
import { MoveSetting } from '@renderer/types/models/moveDirectory'
import { SettingStoreKey } from '@renderer/types/store'
import { setMoveSetting } from '@renderer/stores/slices/moves'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button, Checkbox, Spacer,
} from '@chakra-ui/react'

const validationSchema = z.object({
  isKeepOriginal: z.boolean(),
  isAutoDuplicatedName: z.boolean(),
  isDefaultCheckedOnLoad: z.boolean(),
})
type ValidationSchema = z.infer<typeof validationSchema>

interface Props {
  children: React.ReactElement
}

function MovesDirectorySettingModal({ children }: Props) {
  const setting = useSelector((state: RootState) => state.moves.setting)
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

  useEffect(() => {
    setValue('isAutoDuplicatedName', setting.isAutoDuplicatedName)
    setValue('isKeepOriginal', setting.isKeepOriginal)
    setValue('isDefaultCheckedOnLoad', setting.isDefaultCheckedOnLoad)
  }, [isOpen])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsLoading(true)
      await settingStore.set(SettingStoreKey.MoveSetting, {
        isAutoDuplicatedName: data.isAutoDuplicatedName,
        isKeepOriginal: data.isKeepOriginal,
        isDefaultCheckedOnLoad: data.isDefaultCheckedOnLoad
      } as MoveSetting)

      dispatch(setMoveSetting({
        isAutoDuplicatedName: data.isAutoDuplicatedName,
        isKeepOriginal: data.isKeepOriginal,
        isDefaultCheckedOnLoad: data.isDefaultCheckedOnLoad
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
              <div className="space-y-4">
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isKeepOriginal')}
                >
                  <span>Keep original</span>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isAutoDuplicatedName')}
                >
                  <span>Automatically change duplicated name</span>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  type="checkbox"
                  {...register('isDefaultCheckedOnLoad')}
                >
                  <span>Checked on load file</span>
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

export default MovesDirectorySettingModal
