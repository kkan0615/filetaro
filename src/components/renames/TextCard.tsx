
import { z } from 'zod'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
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
  CardHeader,
  Collapse,
  Flex,
  FormControl, FormErrorMessage,
  FormLabel,
  Heading, Input, Radio, RadioGroup,
  Spacer, Stack,
  Text,
} from '@chakra-ui/react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/all'

const AddMethods = ['prefix', 'suffix'] as const
// type AddMethodType = typeof AddMethods[number]

const validationSchema = z.object({
  text: z.string({
    required_error: 'Required field',
  }).refine(checkSpecialCharsInName, {
    message: '\ / : * < > | are not allowed',
  }),
  methodType: z.enum(AddMethods, {
    required_error: 'Required field',
  }),
})
type ValidationSchema = z.infer<typeof validationSchema>

function RenamesTextCard() {
  const checkedTargetFiles = useSelector((state: RootState) => state.renames.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const setting = useSelector((state: RootState) => state.renames.setting)
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      methodType: 'prefix'
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
        // File name by type
        let tempFileName = ''
        if(data.methodType === 'prefix') {
          tempFileName = `${data.text}${checkedTargetFileEl.name}`
        } else {
          const splitName = checkedTargetFileEl.name.split('.')
          const ext = splitName.pop()
          tempFileName = `${splitName.join('')}${data.text}.${ext}`
        }

        const { newFileNameWithPath, newFileName } = await renameTargetFile({
          file: checkedTargetFileEl,
          newFileName: tempFileName,
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
    <Card>
      <CardHeader onClick={toggleOpen} className="p-3 cursor-pointer">
        <Flex alignItems="center">
          <Heading size="md">Add</Heading>
          <Spacer />
          <Text fontSize="2xl">
            {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </Text>
        </Flex>
      </CardHeader>
      <Collapse in={isOpen} animateOpacity>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody className="p-3 space-y-4">
            <FormControl isInvalid={!!errors.text?.message}>
              <FormLabel>Text</FormLabel>
              <Input
                placeholder="Type text"
                {...register('text')}
              />
              {errors.text?.message ?
                <FormErrorMessage>{errors.text?.message}</FormErrorMessage>
                : null
              }
            </FormControl>
            <Controller
              name="methodType"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControl isInvalid={!!errors.text?.message}>
                  <FormLabel>Method</FormLabel>
                  <RadioGroup onChange={onChange} value={value}>
                    <Stack direction='row'>
                      {AddMethods.map(addMethodEl => (
                        <Radio
                          {...register('methodType')}
                          key={addMethodEl}
                          value={addMethodEl}
                        >
                          {addMethodEl}
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                  {errors.methodType?.message ?
                    <FormErrorMessage>{errors.methodType?.message}</FormErrorMessage>
                    : null
                  }
                </FormControl>
              )}
            />
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

export default RenamesTextCard
