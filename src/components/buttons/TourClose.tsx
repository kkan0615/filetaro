import { IconButton } from '@chakra-ui/react'
import { AiOutlineClose } from 'react-icons/ai'
import { StylesObj } from '@reactour/tour'

interface Props {
  styles?: StylesObj;
  onClick?: () => void;
  disabled?: boolean;
}

function TourCloseBtn({ onClick }: Props) {
  return (
    <IconButton
      color="black"
      size="xs"
      className="rounded-full absolute top-0 right-0"
      variant="ghost"
      onClick={onClick}
      aria-label="Close tour"
      icon={<AiOutlineClose className="text-md" />}
    >
    </IconButton>
  )
}

export default TourCloseBtn
