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
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

interface Props {
  placement?: PlacementWithLogical
}

function KeywordPopover({ placement }: Props) {
  if (!placement) placement = 'auto'

  const { t } = useTranslation()

  return (
    <Popover placement={placement}>
      <Tooltip label={capitalizeFirstLetter(t('components.popovers.keyword.tooltips.help'))} placement={placement}>
        <Box display="inline-block">
          <PopoverTrigger>
            <IconButton
              variant="ghost"
              aria-label={capitalizeFirstLetter(t('components.popovers.keyword.tooltips.help'))}
              icon={<AiOutlineQuestionCircle className="text-2xl" />}
            />
          </PopoverTrigger>
        </Box>
      </Tooltip>
      <PopoverContent boxSize="fit-content">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>{capitalizeFirstLetter(t('components.popovers.keyword.labels.title'))}</PopoverHeader>
        <PopoverBody>
          <Text className="mb-2">{capitalizeFirstLetter(t('components.popovers.keyword.labels.subTitle'))}</Text>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th className="pl-0 pr-2 py-2">{t('components.popovers.keyword.labels.keyword')}</Th>
                  <Th className="pl-0 pr-2 py-2">{t('components.popovers.keyword.labels.description')}</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td className="pl-0 pr-2 py-2">$[today]</Td>
                  <Td className="pl-0 pr-2 py-2">{capitalizeFirstLetter(t('components.popovers.keyword.labels.todayDesc'))}</Td>
                </Tr>
                <Tr>
                  <Td className="pl-0 pr-2 py-2">$[ext]</Td>
                  <Td className="pl-0 pr-2 py-2">{capitalizeFirstLetter(t('components.popovers.keyword.labels.extDesc'))}</Td>
                </Tr>
                <Tr>
                  <Td className="pl-0 pr-2 py-2">$[type]</Td>
                  <Td className="pl-0 pr-2 py-2">{capitalizeFirstLetter(t('components.popovers.keyword.labels.typeDesc'))}</Td>
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
