import { z } from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { renameTargetFile } from '@renderer/utils/file'
import { updateRenameTargetFile } from '@renderer/stores/slices/renames'
import { checkSpecialCharsInName } from '@renderer/utils/validation'
import {
  Button, Card,
  CardBody, CardFooter,
  CardHeader,
  Collapse,
  Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Spacer,
  Text
} from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'

const validationSchema = z.object({
  text: z.string({
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field',
    }).refine(checkSpecialCharsInName, {
      message: '\ / : * < > | are not allowed',
    }),
})
type ValidationSchema = z.infer<typeof validationSchema>

function RenamesSuffixCard() {
  const checkedTargetFiles = useSelector((state: RootState) => state.renames.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.renames.setting)
  const applicationSetting = useSelector((state: RootState) => state.applications.setting)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsOpen(setting.isDefaultOpenCard)
  }, [setting.isDefaultOpenCard])

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      if (!checkedTargetFiles.length) {
        toast('Select any files', {
          type: 'warning'
        })
        return
      }
      setIsLoading(true)

      await Promise.all(checkedTargetFiles.map(async (checkedTargetFileEl) => {
        const splitName = checkedTargetFileEl.name.split('.')
        const ext = splitName.pop()

        const { newFileNameWithPath, newFileName } = await renameTargetFile({
          file: checkedTargetFileEl,
          newFileName: `${splitName.join('')}${data.text}.${ext}`,
          isAutoDuplicatedName: setting.isAutoDuplicatedName,
        })

        dispatch(updateRenameTargetFile({
          path: checkedTargetFileEl.path,
          newData: {
            ...checkedTargetFileEl,
            path: newFileNameWithPath,
            name: newFileName,
          }
        }))
      }))

      toast('Success to rename files', {
        type: 'success'
      })
      reset()
    } catch (e) {
      console.error(e)
      toast('Error to rename files', {
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <Card>
      <CardHeader onClick={toggleOpen} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">Add suffix</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="p-3">
            <FormControl isInvalid={!!errors.text?.message}>
              <FormLabel>Prefix Text</FormLabel>
              <Input
                placeholder="Type text"
                {...register('text')}
              />
              {errors.text?.message ?
                <FormErrorMessage>{errors.text.message}</FormErrorMessage>
                : null
              }
            </FormControl>
          </CardBody>
          <CardFooter className="p-3">
            <Button
              width='100%'
              color="white"
              colorScheme="primary"
              type="submit"
              isLoading={isLoading}
              loadingText='Submitting'
            >
              Submit
            </Button>
          </CardFooter>
        </form>
      </Collapse>
    </Card>
  )
}

export default RenamesSuffixCard
