import { capitalizeFirstLetter } from '@renderer/utils/text'
import {
  Button, Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tooltip, useBoolean
} from '@chakra-ui/react'
import { AiFillHeart } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'

const handleKofiClick = () => {
  open('https://ko-fi.com/youngjinkwak')
}

const handlePaypalClick = () => {
  open('https://www.paypal.com/paypalme/YoungjinKwak')
}

function SponsorsDialog() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useBoolean()
  return (
    <>
      <Tooltip label={capitalizeFirstLetter(t('tooltips.sponsors'))}>
        <Button
          borderColor="red"
          id="add-files-from-directory-button"
          onClick={setIsOpen.toggle}
          variant="outline"
          aria-label={capitalizeFirstLetter(t('buttons.sponsors'))}
          leftIcon={<AiFillHeart className="text-2xl" />}
          _hover={{ bg: 'red' }}
        >
          {capitalizeFirstLetter(t('buttons.sponsors'))}
        </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onClose={setIsOpen.toggle} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {capitalizeFirstLetter(t('components.sponsorsDialog.title'))}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="mb-4">
              <h6 className="text-xl mb-2">Ko-fi</h6>
              <button onClick={handleKofiClick}>
                <Image
                  width={300}
                  src="/public/sponsors/kofi-button.svg"
                />
              </button>
            </div>
            <div>
              <h6 className="text-xl mb-2">Paypal</h6>
              <button onClick={handlePaypalClick}>
                <Image
                  width={300}
                  src="/public/sponsors/paypal.png"
                />
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SponsorsDialog
