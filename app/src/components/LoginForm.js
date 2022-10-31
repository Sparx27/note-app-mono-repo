/* { username, password, handleUsernameChange, handlePasswordChange, handleSubmit} */

import { ToggLable } from "./Toggeable"
import Proptypes from 'prop-types'

export const LoginForm = (props) => {
  
  return (
    <ToggLable buttonLabel={'Login'}>
        <form onSubmit={props.handleSubmit}>
          <div>
            <input
              type='text'
              value={props.username}
              name='Username'
              placeholder='Username'
              onChange={props.handleUsernameChange}
            />
          </div>
          <div>
            <input
              type='password'
              value={props.password}
              name='Pasword'
              placeholder='Pasword'
              onChange={props.handlePasswordChange}
            />
          </div>
          <button>Login</button>
        </form>
    </ToggLable>
  )
}

LoginForm.propTypes = {
  handleSubmit: Proptypes.func.isRequired,
  username: Proptypes.string
}
