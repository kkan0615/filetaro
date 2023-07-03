import {
  Box, Button,
  IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text,
  Tooltip, useDisclosure
} from '@chakra-ui/react'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'

export default function SlidesHelp() {
  const { t } = useTranslation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Tooltip label={capitalizeFirstLetter(t('tooltips.help'))} placement='auto'>
        <Box display="inline-block">
          <IconButton
            variant="ghost"
            aria-label={capitalizeFirstLetter(t('labels.help'))}
            icon={<AiOutlineQuestionCircle className="text-2xl" />}
            onClick={onOpen}
          />
        </Box>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{capitalizeFirstLetter(t('labels.help'))}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text className="mb-2">{capitalizeFirstLetter(t('texts.differentDisk'))}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
