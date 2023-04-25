import { IconButton, Tooltip } from '@chakra-ui/react'
import { AiOutlineFolderAdd } from 'react-icons/ai'
import { open } from '@tauri-apps/api/dialog'
import { toast } from 'react-toastify'

interface Props {
  onSelected: (filePaths: string[]) => void
}

function AddFileBtn({ onSelected } : Props) {
  const handleClick = async () => {
    try {
      const filePaths = await open({
        title: 'Select Directory',
        directory: false,
        multiple: true,
      })

      if (filePaths && filePaths.length) {
        onSelected(filePaths as string[])
      }
    } catch (e) {
      console.error(e)
      toast('Error to add files', {
        type: 'error'
      })
    }
  }

  return (
    <Tooltip label="Add files">
      <IconButton
        id="add-files-button"
        onClick={handleClick}
        variant="ghost"
        aria-label="home"
        icon={<AiOutlineFolderAdd className="text-2xl" />}
      />
    </Tooltip>
  )
}

export default AddFileBtn
