import {
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tooltip,
  Box,
  TableContainer,
  Text,
  Thead,
  Table,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { PlacementWithLogical } from '@chakra-ui/popper/dist/popper.placement'

interface Props {
  placement?: PlacementWithLogical
}

function KeywordPopover({ placement }: Props) {
  if (!placement) placement = 'auto'
  return (
    <Popover placement={placement}>
      <Tooltip label='Keyword help' placement={placement}>
        <Box display="inline-block">
          <PopoverTrigger>
            <IconButton
              variant="ghost"
              aria-label="help"
              icon={<AiOutlineQuestionCircle className="text-2xl" />}
            />
          </PopoverTrigger>
        </Box>
      </Tooltip>
      <PopoverContent boxSize="fit-content">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Keywords</PopoverHeader>
        <PopoverBody>
          <Text className="mb-2">Replace keyword to specific words</Text>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th className="pl-0 pr-2 py-2">Keyword</Th>
                  <Th className="pl-0 pr-2 py-2">Description</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className="pl-0 pr-2 py-2">$[today]</Td>
                  <Td className="pl-0 pr-2 py-2">Display Today with predefined format</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default KeywordPopover
