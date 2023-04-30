import { ChangeEvent } from 'react'
import { Select } from '@chakra-ui/react'
import { Locales } from '@renderer/types/i18n'
import { useTranslation } from 'react-i18next'

function LanguageSelect() {
  const { t, i18n } = useTranslation()
  const handleChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    try {
      await i18n.changeLanguage(e.target.value)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Select value={i18n.language} onChange={handleChange} className="select select-bordered">
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
