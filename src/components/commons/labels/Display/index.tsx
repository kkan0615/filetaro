interface Props {
  children: string | React.ReactElement
}

function CDisplayLabel({ children }: Props) {
  return (
    <div className="opacity-80">
      {children}
    </div>
  )
}

export default CDisplayLabel
