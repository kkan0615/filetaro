import { Select } from '@chakra-ui/react'
import { Locales } from '@renderer/types/i18n'
import { useTranslation } from 'react-i18next'

function LanguageSelect() {
  const { t } = useTranslation()

  return (
    <Select className="select select-bordered">
      {Locales.map(localeEl => (
        <option
          value={localeEl}
          key={localeEl}
        >
          {t(`i18n.${localeEl}`)}
        </option>
      ))}
    </Select>
  )
}

export default LanguageSelect
