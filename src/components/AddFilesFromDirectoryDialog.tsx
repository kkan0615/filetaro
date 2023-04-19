import { AiOutlineFolderOpen } from 'react-icons/ai'
import { useState } from 'react'
import { open } from '@tauri-apps/api/dialog'
import { FileEntry, readDir } from '@tauri-apps/api/fs'
import { getTargetFileTypeByExt, TargetFile } from '@renderer/types/models/targetFile'
import { path } from '@tauri-apps/api'
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

const validationSchema = z.object({
  directoryPath: z.string({
    // Not empty
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field'
    }),
  isRecursive: z.boolean()
})
type ValidationSchema = z.infer<typeof validationSchema>

interface Props {
  onAddFiles: (files: TargetFile[]) => void
}

function AddFilesFromDirectoryDialog({ onAddFiles }: Props) {
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
  // const [directoryPath, setDirectoryPath] = useState('')
  // const [isRecursive, setIsRecursive] = useState(false)

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  const selectDirectory = async () => {
    const directoryPath = await open({
      title: 'Select Directory',
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
      toast(`Success to load (${files.length}) files`, {
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
    }
  }

  return (
    <>
      <Tooltip label="Add files from directory">
        <IconButton
          onClick={toggleOpen}
          variant="ghost"
          aria-label="home"
          icon={<AiOutlineFolderOpen className="text-2xl" />}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onClose={toggleOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>
              Add files from directories
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="space-y-4">
                <FormControl isInvalid={!!errors.directoryPath?.message}>
                  <FormLabel>Select or type directory path</FormLabel>
                  <InputGroup>
                    <Input
                      placeholder="Type here"
                      {...register('directoryPath')}
                    />
                    <InputRightElement>
                      <Tooltip label="select directory">
                        <IconButton
                          variant="ghost"
                          onClick={selectDirectory}
                          aria-label="select directory"
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
                  <span>recursive</span>
                </Checkbox>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="primary" color="text-white">
                Load
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddFilesFromDirectoryDialog
