import { IconButton, Tooltip } from '@chakra-ui/react'
import { AiOutlineFolderAdd } from 'react-icons/ai'
import { open } from '@tauri-apps/api/dialog'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

interface Props {
  onSelected: (filePaths: string[]) => void
}

function AddFileBtn({ onSelected } : Props) {
  const { t } = useTranslation()

  const handleClick = async () => {
    try {
      const filePaths = await open({
        title: capitalizeFirstLetter(t('labels.selectDirectory')),
        directory: false,
        multiple: true,
      })

      if (filePaths && filePaths.length) {
        onSelected(filePaths as string[])
      }
    } catch (e) {
      console.error(e)
      toast(capitalizeFirstLetter(t('texts.alerts.addFilesError')), {
        type: 'error'
      })
    }
  }

  return (
    <Tooltip label={capitalizeFirstLetter(t('tooltips.addFiles'))}>
      <IconButton
        id="add-files-button"
        onClick={handleClick}
        variant="ghost"
        aria-label={capitalizeFirstLetter(t('tooltips.addFiles'))}
        icon={<AiOutlineFolderAdd className="text-2xl" />}
      />
    </Tooltip>
  )
}

export default AddFileBtn
