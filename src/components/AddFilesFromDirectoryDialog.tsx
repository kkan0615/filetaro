import { AiOutlineFolderOpen } from 'react-icons/ai'
import { useState } from 'react'
import { open } from '@tauri-apps/api/dialog'
import { TargetFile } from '@renderer/types/models/targetFile'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button, Checkbox, FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay, Tooltip
} from '@chakra-ui/react'
import { findAllFilesInDirectory } from '@renderer/utils/file'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

interface Props {
  onAddFiles: (files: TargetFile[]) => void
}

function AddFilesFromDirectoryDialog({ onAddFiles }: Props) {
  const { t } = useTranslation()
  const validationSchema = z.object({
    directoryPath: z.string({
      // Not empty
      required_error: capitalizeFirstLetter(t('texts.validations.required')),
    })
      // Not empty
      .min(1, {
        message: capitalizeFirstLetter(t('texts.validations.required')),
      }),
    isRecursive: z.boolean()
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
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const selectDirectory = async () => {
    const directoryPath = await open({
      title: capitalizeFirstLetter(t('labels.selectDirectory')),
      directory: true,
    })
    setValue('directoryPath', (directoryPath as string) || '')
  }

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      const files = await findAllFilesInDirectory({
        directoryPath: data.directoryPath,
        isRecursive: data.isRecursive,
      })
      onAddFiles(files)
      toast(capitalizeFirstLetter(t('texts.alerts.sameDirectoryWarning', { count: files.length })), {
        type: 'success'
      })
      // toggle on-off
      toggleOpen()
      // Reset state
      reset()
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('texts.alerts.loadFilesError')), {
        type: 'error'
      })
    }
  }

  return (
    <>
      <Tooltip label={capitalizeFirstLetter(t('tooltips.addFilesFromDirectory'))}>
        <IconButton
          id="add-files-from-directory-button"
          onClick={toggleOpen}
          variant="ghost"
          aria-label={capitalizeFirstLetter(t('tooltips.addFilesFromDirectory'))}
          icon={<AiOutlineFolderOpen className="text-2xl" />}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={toggleOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              {capitalizeFirstLetter(t('components.addFilesFromDirectoryDialog.title'))}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="space-y-4">
                <FormControl isInvalid={!!errors.directoryPath?.message}>
                  <FormLabel>{capitalizeFirstLetter(t('labels.selectDirectoryPath'))}</FormLabel>
                  <InputGroup>
                    <Input
                      placeholder={capitalizeFirstLetter(t('placeholders.typeHere'))}
                      {...register('directoryPath')}
                    />
                    <InputRightElement>
                      <Tooltip label={capitalizeFirstLetter(t('tooltips.selectDirectory'))}>
                        <IconButton
                          variant="ghost"
                          onClick={selectDirectory}
                          aria-label={capitalizeFirstLetter(t('tooltips.selectDirectory'))}
                          icon={<AiOutlineFolderOpen className="text-2xl" />}
                        >
                        </IconButton>
                      </Tooltip>
                    </InputRightElement>
                  </InputGroup>
                  {errors.directoryPath?.message ?
                    <FormErrorMessage>{errors.directoryPath.message}</FormErrorMessage>
                    : null
                  }
                </FormControl>
                <Checkbox
                  size="lg"
                  iconColor="white"
                  colorScheme="primary"
                  {...register('isRecursive')}
                >
                  <span>{capitalizeFirstLetter(t('labels.recursive'))}</span>
                </Checkbox>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="primary" color="text-white">
                {capitalizeFirstLetter(t('buttons.load'))}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddFilesFromDirectoryDialog
