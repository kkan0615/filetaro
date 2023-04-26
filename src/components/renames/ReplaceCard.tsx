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
  Button,
  Card,
  CardBody, CardFooter,
  CardHeader, Checkbox,
  Collapse,
  Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, Input,
  Spacer,
  Text
} from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'

const validationSchema = z.object({
  targetStr: z.string({
    required_error: 'Required field',
  })
    // Not empty
    .min(1, {
      message: 'Required field',
    }),
  replaceStr: z.string({
    required_error: 'Required field',
  }).refine(checkSpecialCharsInName, {
    message: '\ / : * < > | are not allowed',
  }),
  isReplaceAll: z.boolean({
    required_error: 'Required field',
  })
})
type ValidationSchema = z.infer<typeof validationSchema>

function RenamesReplaceCard() {
  const checkedTargetFiles = useSelector((state: RootState) => state.renames.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.renames.setting)

  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      isReplaceAll: true,
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsOpen(setting.isDefaultOpenCard)
  }, [setting.isDefaultOpenCard])

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

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
        let replacedFileName = ''
        // Replace all text
        if (data.isReplaceAll) {
          replacedFileName = checkedTargetFileEl.name.replaceAll(data.targetStr, data.replaceStr)
        } else {
          // Replace first text
          replacedFileName = checkedTargetFileEl.name.replace(data.targetStr, data.replaceStr)
        }

        const { newFileNameWithPath, newFileName } = await renameTargetFile({
          file: checkedTargetFileEl,
          newFileName: replacedFileName,
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

  return (
    <Card id="replace-card">
      <CardHeader onClick={toggleOpen} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">Replacer</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="p-3 space-y-4">
            <FormControl isInvalid={!!errors.targetStr?.message}>
              <FormLabel>Target Text</FormLabel>
              <Input
                placeholder="Type text"
                {...register('targetStr')}
              />
              {errors.replaceStr?.message ?
                <FormErrorMessage>{errors.targetStr?.message}</FormErrorMessage>
                : null
              }
            </FormControl>
            <FormControl isInvalid={!!errors.replaceStr?.message}>
              <FormLabel>Replace Text</FormLabel>
              <Input
                placeholder="Type text"
                {...register('replaceStr')}
              />
              {errors.replaceStr?.message ?
                <FormErrorMessage>{errors.replaceStr?.message}</FormErrorMessage>
                : null
              }
            </FormControl>
            <Checkbox
              size="lg"
              iconColor="white"
              colorScheme="primary"
              type="checkbox"
              {...register('isReplaceAll')}
            >
              <span>Replace all text</span>
            </Checkbox>
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

export default RenamesReplaceCard
