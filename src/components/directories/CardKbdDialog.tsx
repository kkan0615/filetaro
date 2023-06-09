import {
  Button,
  FormControl, FormErrorMessage, FormLabel, IconButton, Input, Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay, Spacer, Tooltip,
  useBoolean
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { AiOutlinePlus } from 'react-icons/ai'
import { ask } from '@tauri-apps/api/dialog'
import { RootState } from '@renderer/stores'
import { MoveDirectory } from '@renderer/types/models/move'
import { setMoveIsBlockKey, updateMoveDirectoryByPath } from '@renderer/stores/slices/moves'
import { getKBD } from '@renderer/utils/keyboard'

interface Props {
  directory: MoveDirectory
}

function DirectoryCardKbdDialog({ directory } :Props) {
  const { t } = useTranslation()

  const directories = useSelector((state: RootState) => state.moves.moveDirectories)
  const dispatch = useDispatch()

  const validationSchema = z.object({
    text: z.string({
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
      // Not empty
      .min(1, {
        message: capitalizeFirstLetter(t('texts.validations.fileName')),
      }),
  })
  type ValidationSchema = z.infer<typeof validationSchema>
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })

  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Keydown event Effect
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    dispatch(setMoveIsBlockKey(isOpen))
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      dispatch(setMoveIsBlockKey(false))
    }
  }, [isOpen])

  /**
   * window Keydown handler
   * @param event
   */
  const handleKeydown = (event: KeyboardEvent) => {
    const kbd = getKBD(event)

    setValue('text', kbd.join('+'))
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsLoading(true)
      const kbd = data.text.split('+')
      // Check duplicated KBD
      const found = directories
        .filter(directoryEl => directoryEl.kbd)
        .find(directoryEl => JSON.stringify(directoryEl.kbd?.slice().sort()) === JSON.stringify(kbd.slice().sort()))
        // .find(directoryEl => R.equals(directoryEl.kbd?.slice().sort()), kbd.slice().sort())
      if (found && found.path !== directory.path) {
        const yes = await ask(capitalizeFirstLetter(t('pages.moves.texts.prompts.duplicatedKBD')), {
          title: capitalizeFirstLetter(t('labels.warning')),
          type: 'warning'
        })
        if (!yes) {
          toast(capitalizeFirstLetter(t('pages.moves.texts.alerts.replaceKBDWarn')), {
            type: 'warning'
          })
          return
        }
        // remove kbd
        dispatch(updateMoveDirectoryByPath({
          ...found,
          kbd: undefined,
        }))
      }
      // Change KBD
      dispatch(updateMoveDirectoryByPath({
        ...directory,
        kbd,
      }))

      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.updateKBDSuccess')), {
        type: 'success'
      })

      setIsOpen.off()
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.updateKBDError')), {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }
  const handleToggleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsOpen.toggle()
  }

  return (
    <>
      <Tooltip placement="auto" label={capitalizeFirstLetter(t('labels.changeKBD'))}>
        <IconButton
          variant="solid"
          size="xs"
          ml="auto"
          aria-label={capitalizeFirstLetter(t('labels.changeKBD'))}
          onClick={handleToggleClick}
        >
          <AiOutlinePlus className="text-md" />
        </IconButton>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={setIsOpen.toggle} isCentered>
        <ModalOverlay />
        <ModalContent>
          <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {capitalizeFirstLetter(t('labels.changeKBD'))}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="space-y-4">
                <FormControl isInvalid={!!errors.text?.message}>
                  <FormLabel>{capitalizeFirstLetter(t('labels.text'))}</FormLabel>
                  {/*@TODO: Add placeholder */}
                  <Input
                    placeholder={capitalizeFirstLetter(t('placeholders.listeningKBD'))}
                    readOnly={true}
                    {...register('text')}
                  />
                  {errors.text?.message ?
                    <FormErrorMessage>{errors.text.message}</FormErrorMessage>
                    : null
                  }
                </FormControl>
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

export default DirectoryCardKbdDialog
