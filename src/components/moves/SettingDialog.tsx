import { useEffect, useState } from 'react'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { settingStore } from '@renderer/stores/tauriStore'
import { MoveSetting } from '@renderer/types/models/move'
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
  Button, Checkbox, Spacer, Tooltip, useBoolean,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

const validationSchema = z.object({
  isKeepOriginal: z.boolean(),
  isAutoDuplicatedName: z.boolean(),
  isDefaultCheckedOnLoad: z.boolean(),
  isAutoPlay: z.boolean(),
})
type ValidationSchema = z.infer<typeof validationSchema>

interface Props {
  children: React.ReactElement
}

function MovesSettingModal({ children }: Props) {
  const { t } = useTranslation()

  const setting = useSelector((state: RootState) => state.moves.setting)
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
    setValue('isAutoDuplicatedName', setting.isAutoDuplicatedName)
    setValue('isKeepOriginal', setting.isKeepOriginal)
    setValue('isDefaultCheckedOnLoad', setting.isDefaultCheckedOnLoad)
    setValue('isAutoPlay', setting.isAutoPlay)
  }, [isOpen])

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsLoading(true)
      await settingStore.set(SettingStoreKey.MoveSetting, {
        ...setting,
        isAutoDuplicatedName: data.isAutoDuplicatedName,
        isKeepOriginal: data.isKeepOriginal,
        isDefaultCheckedOnLoad: data.isDefaultCheckedOnLoad,
        isAutoPlay: data.isAutoPlay,
      } as MoveSetting)

      dispatch(setMoveSetting({
        isAutoDuplicatedName: data.isAutoDuplicatedName,
        isKeepOriginal: data.isKeepOriginal,
        isDefaultCheckedOnLoad: data.isDefaultCheckedOnLoad,
        isAutoPlay: data.isAutoPlay,
      }))

      toast(capitalizeFirstLetter(t('texts.alerts.saveSettingSuccess')), {
        type: 'success'
      })
      setIsOpen.toggle()
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
        <ModalContent>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {capitalizeFirstLetter(t('labels.setting'))}
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
                  <Tooltip label={capitalizeFirstLetter(t('tooltips.keepOriginal'))} placement='auto'>
                    <span>{capitalizeFirstLetter(t('labels.keepOriginal'))}</span>
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isAutoDuplicatedName')}
                >
                  <Tooltip label={capitalizeFirstLetter(t('tooltips.autoRenameFile'))} placement='auto'>
                    <span>{capitalizeFirstLetter(t('labels.autoRenameFile'))}</span>
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  type="checkbox"
                  {...register('isDefaultCheckedOnLoad')}
                >
                  <Tooltip label={capitalizeFirstLetter(t('tooltips.checkLoadedFiles'))} placement='auto'>
                    <span>{capitalizeFirstLetter(t('labels.checkLoadedFiles'))}</span>
                  </Tooltip>
                </Checkbox>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  type="checkbox"
                  {...register('isAutoPlay')}
                >
                  <Tooltip label={capitalizeFirstLetter(t('pages.moves.tooltips.isAutoPlay'))} placement='auto'>
                    <span>{capitalizeFirstLetter(t('pages.moves.labels.isAutoPlay'))}</span>
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
                {capitalizeFirstLetter(t('buttons.save'))}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MovesSettingModal
