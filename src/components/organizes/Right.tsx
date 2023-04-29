import { Box, Card, CardBody, Flex, Heading, IconButton, List, Spacer, Tooltip } from '@chakra-ui/react'
import { AiOutlineSetting } from 'react-icons/ai'
import KeywordPopover from '@renderer/components/popovers/Keyword'
import OrganizesSettingModal from '@renderer/components/organizes/SettingDialog'
import DirectoryPathCard from '@renderer/components/organizes/DirectoryPathCard'
import OrganizesTypeCard from '@renderer/components/organizes/TypeCard'
import OrganizesExtensionCard from '@renderer/components/organizes/ExtensionCard'
import OrganizesTextCard from '@renderer/components/organizes/TextCard'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@renderer/utils/text'

function OrganizesRight() {
  const { t } = useTranslation()

  return (
    <div className="h-full flex-1 flex flex-col">
      <div className="min-h-0 mb-2 shrink p-2">
        <Card position="static" className="p-0">
          <CardBody padding={0} className="p-2 py-1">
            <Flex alignItems="center">
              <Heading size="md">{capitalizeFirstLetter(t('pages.organizes.labels.functions'))}</Heading>
              <Spacer />
              <KeywordPopover />
              <OrganizesSettingModal>
                <Tooltip label={capitalizeFirstLetter(t('tooltips.openSetting'))} placement='auto'>
                  <IconButton
                    variant="ghost"
                    aria-label={capitalizeFirstLetter(t('tooltips.openSetting'))}
                    icon={<AiOutlineSetting className="text-2xl" />}
                  />
                </Tooltip>
              </OrganizesSettingModal>
            </Flex>
          </CardBody>
        </Card>
      </div>
      <Box className="grow h-1 overflow-y-auto px-4 py-2">
        <List spacing={4}>
          <DirectoryPathCard />
          <OrganizesTypeCard />
          <OrganizesExtensionCard />
          <OrganizesTextCard/>
        </List>
      </Box>
    </div>
  )
}

export default OrganizesRight
