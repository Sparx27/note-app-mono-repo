import React, { forwardRef, useImperativeHandle, useState } from "react"
import Proptypes from 'prop-types'

export const ToggLable = forwardRef(({ children, buttonLabel }, ref) => {
  const [visible, setVisible] = useState(false)

  const hiddenWhenVisible = { display: visible ? 'none' : ''}
  const showWhenVisible = { display: visible ? '' : 'none'}

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hiddenWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>

      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>Cancel</button>
      </div>
    </div>
  )
})

ToggLable.displayName = 'ToggLable' // Con los errores del proptypes te dice que componente es
// NOTA: En caso de hacer un export con funcion nombrada no seria necesario

// De npm install prop-types
ToggLable.propTypes = { // Esto es solo informativo, aunque me equivoque el componente funciona igual, solo avisa
  buttonLabel: Proptypes.string.isRequired
}
