import { AiOutlineSetting } from 'react-icons/ai'
import { Card, CardBody, Flex, IconButton, Spacer, Tooltip, Heading, List, Box } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'
import RenamesReplaceCard from '@renderer/components/renames/ReplaceCard'
import RenamesSettingModal from '@renderer/components/renames/SettingDialog'
import RenamesTextCard from '@renderer/components/renames/TextCard'
import KeywordPopover from '@renderer/components/popovers/Keyword'

function RenamesRight() {
  const { t } = useTranslation()

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 mb-2 shrink p-2">
        <Card position="static" className="p-0">
          <CardBody padding={0} className="p-2 py-1">
            <Flex alignItems="center">
              <Heading size="md">{capitalizeFirstLetter(t('pages.renames.labels.functions'))}</Heading>
              <Spacer />
              <KeywordPopover />
              <RenamesSettingModal>
                <Tooltip label={capitalizeFirstLetter(t('tooltips.openSetting'))} placement='auto'>
                  <IconButton
                    variant="ghost"
                    aria-label={capitalizeFirstLetter(t('tooltips.openSetting'))}
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </RenamesSettingModal>
            </Flex>
          </CardBody>
        </Card>
      </div>
      <Box className="grow h-1 overflow-y-auto px-4 py-2">
        <List spacing={4}>
          <RenamesTextCard />
          <RenamesReplaceCard />
        </List>
      </Box>
    </div>
  )
}

export default RenamesRight
