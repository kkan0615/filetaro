import { HTMLProps, useEffect, useRef } from 'react'

function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className="w-4 h-4 accent-primary rounded"
      {...rest}
    />
  )
  // return <Checkbox ref={ref} {...rest} />
}
export default IndeterminateCheckbox
