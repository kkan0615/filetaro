import { useEffect, useState } from 'react'
import { path } from '@tauri-apps/api'
import { Card, Tooltip, IconButton, CardBody, Flex, Kbd } from '@chakra-ui/react'
import { AiOutlineClose } from 'react-icons/ai'
import _ from 'lodash'
import { MoveDirectory } from '@renderer/types/models/move'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@renderer/stores'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import DirectoryCardKbdDialog from '@renderer/components/directories/CardKbdDialog'
import { getKBD } from '@renderer/utils/keyboard'

interface Props {
  directory: MoveDirectory
  onRemove: (directory: MoveDirectory) => void
  onClick: (directory: MoveDirectory) => void
}

export function DirectoryCard({ directory, onRemove, onClick }: Props) {
  const { t } = useTranslation()

  const checkedTargetFiles = useSelector((state: RootState) => state.moves.targetFiles.filter(targetFileEl => targetFileEl.checked))
  const isBlockKey = useSelector((state: RootState) => state.moves.isBlockKey)

  const [directoryName, setDirectoryName] = useState('')

  useEffect(() => {
    path.basename(directory.path)
      .then(value => setDirectoryName(value))
  }, [directory])

  useEffect(() => {
    if (!isBlockKey) window.addEventListener('keyup', handleKeyup)
    return () => {
      window.removeEventListener('keyup', handleKeyup)
    }
  }, [directory, checkedTargetFiles, isBlockKey])

  const handleKeyup = async (event: KeyboardEvent) => {
    const kbd = getKBD(event)
    if (!kbd.length) return

    if (_.isEqual(directory.kbd ,kbd) && checkedTargetFiles.length) {
      await handleCard()
    }
  }

  /**
   * Click event for Card
   */
  const handleCard = () => {
    onClick(directory)
  }

  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onRemove(directory)
  }

  return (
    <Card
      onClick={handleCard}
      className="relative cursor-pointer hover:scale-105 transition ease-in-out duration-300"
    >
      <Tooltip label={capitalizeFirstLetter(t('labels.removeDirectory'))}>
        <IconButton
          variant="solid"
          size="xs"
          className="rounded-full absolute -top-2 -right-2"
          aria-label={capitalizeFirstLetter(t('labels.removeDirectory'))}
          onClick={handleRemove}
        >
          <AiOutlineClose className="text-md" />
        </IconButton>
      </Tooltip>
      <CardBody>
        <div className="space-y-2">
          <Flex alignItems="center">
            <div className="w-3/12">{capitalizeFirstLetter(t('labels.name'))}:</div>
            <div>{directoryName}</div>
          </Flex>
          <Flex alignItems="center">
            <div className="w-3/12">{capitalizeFirstLetter(t('labels.path'))}:</div>
            <div className="break-all">{directory.path}</div>
          </Flex>
          <div className="flex">
            <div className="flex gap-x-2">
              {directory.kbd?.map((kbdEl) => (
                <Kbd key={kbdEl}>
                  {kbdEl}
                </Kbd>
              ))}
            </div>
            <DirectoryCardKbdDialog directory={directory} />
          </div>
        </div>
      </CardBody>
    </Card>
  )
}

export default DirectoryCard
