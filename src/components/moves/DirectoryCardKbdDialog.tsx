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
import { RootState } from '@renderer/stores'
import { MoveDirectory } from '@renderer/types/models/move'
import { updateMoveDirectoryByPath } from '@renderer/stores/slices/moves'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'

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
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })

  const [isOpen, setIsOpen] = useBoolean()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) window.addEventListener('keydown', handleKeyPress)
    else window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  const handleKeyPress = (event: KeyboardEvent) => {
    const kbds: string[] = []
    if (event.ctrlKey) kbds.push('ctrl')
    if (event.altKey) kbds.push('alt')
    if (event.shiftKey) kbds.push('shift')
    if (!['Control', 'Alt', 'Shift'].includes(event.key)) kbds.push(event.key)

    setValue('text', kbds.join('+'))
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      setIsLoading(true)
      const kdbs = data.text.split('+')

      dispatch(updateMoveDirectoryByPath({
        ...directory,
        kbd: kdbs
      }))

      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.organizeSuccess')), {
        type: 'success'
      })

      setIsOpen.off()
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('pages.organizes.texts.alerts.organizeError')), {
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
      <Tooltip placement="auto" label={capitalizeFirstLetter(t('labels.selectDirectory'))}>
        {/*<Button*/}
        {/*    size="xs"*/}
        {/*    ml="auto"*/}
        {/*    aria-label={capitalizeFirstLetter(t('labels.removeDirectory'))}*/}
        {/*    onClick={handleToggleClick}*/}
        {/*  >*/}
        {/*    KBD*/}
        {/*  </Button>*/}
        <IconButton
          variant="solid"
          size="xs"
          ml="auto"
          aria-label={capitalizeFirstLetter(t('labels.removeDirectory'))}
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
              {capitalizeFirstLetter(t('labels.setting'))}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="space-y-4">
                <FormControl isInvalid={!!errors.text?.message}>
                  <FormLabel>{capitalizeFirstLetter(t('labels.text'))}</FormLabel>
                  <Input
                    placeholder={capitalizeFirstLetter(t('placeholders.typeHere'))}
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
