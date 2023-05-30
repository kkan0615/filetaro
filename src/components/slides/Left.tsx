import { Button, Card, CardBody, Heading, Text } from '@chakra-ui/react'
import { BiArrowBack } from 'react-icons/bi'
import { MdDriveFileMoveOutline } from 'react-icons/all'
import { useTranslation } from 'react-i18next'
import AddFilesFromDirectoryDialog from '@renderer/components/dialogs/AddFilesFromDirectory'
import { getTargetFileTypeByExt, TargetFile } from '@renderer/types/models/targetFile'
import { addTargetFile } from '@renderer/stores/slices/moves'
import AddFileBtn from '@renderer/components/buttons/AddFile'
import { path } from '@tauri-apps/api'
import { toast } from 'react-toastify'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { Link } from 'react-router-dom'

function SlidesLeft() {
  const { t } = useTranslation()

  const addFiles = async (filePaths: string[]) => {
    try {
      // await Promise.all(
      //   filePaths.map(async (filePathEl, index) => {
      //     dispatch(
      //       addTargetFile({
      //         name: await path.basename(filePathEl),
      //         type: getTargetFileTypeByExt(await path.extname(filePathEl)),
      //         ext: await path.extname(filePathEl),
      //         checked: setting.isDefaultCheckedOnLoad,
      //         path: filePathEl,
      //       })
      //     )
      //
      //     const key = targetFiles.length + index
      //     setRowSelection(prevState => ({
      //       ...prevState,
      //       [key]: setting.isDefaultCheckedOnLoad,
      //     }))
      //   })
      // )
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('texts.alerts.addFilesError')), {
        type: 'error'
      })
    }
  }

  const loadFiles = async (files: TargetFile[]) => {
    // files.map((fileEl, index) => {
    //   dispatch(
    //     addTargetFile({
    //       ...fileEl,
    //       checked: setting.isDefaultCheckedOnLoad,
    //     })
    //   )
    //   const key = targetFiles.length + index
    //   setRowSelection(prevState => ({
    //     ...prevState,
    //     [key]: setting.isDefaultCheckedOnLoad,
    //   }))
    // })
  }

  return (
    <div
      className="h-full flex flex-col relative"
      style={{
        width: '75%', // w-9/12 not working because of important
      }}
    >
      <div className="h-full flex items-center justify-center">
        <div>
          <Card className="text-base-content">
            <CardBody className="text-center">
              <Text>Add files before start</Text>
              <div className="mt-4">
                <AddFileBtn onSelected={addFiles} />
                <AddFilesFromDirectoryDialog onAddFiles={loadFiles} />
              </div>
            </CardBody>
          </Card>
          <Link to="/">
            <Button
              className="mt-4"
              leftIcon={<BiArrowBack />}
              variant="ghost"
            >
            Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SlidesLeft
