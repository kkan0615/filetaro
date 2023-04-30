interface Props {
  children: React.ReactElement | string
  active: boolean
  onClick: () => void
}

function SettingDialogMenuItem({ children, onClick, active }: Props) {
  return (
    <li
      onClick={onClick}
      className={`py-2 px-4 cursor-pointer text-white hover:bg-primary ${active ? 'bg-primary text-white' : ''}`}
    >
      {children}
    </li>
  )
}

export default SettingDialogMenuItem
