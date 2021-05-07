import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client';

const USER_LOGIN = gql`
  mutation userLogin($input: userCredsInput!){
    userLogin(input:$input){
      token
    }
}
`

const Login = () => {

    let history = useHistory()

    const [userLogin, { data }] = useMutation(USER_LOGIN);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async e => {
        e.preventDefault()
        userLogin({variables: {input: {email, password}}})
    }

    useEffect(() => {
      if (data) {
          localStorage.setItem('AUTH_TOKEN', JSON.stringify(data.userLogin.token))
          history.push('/')
      }
    }, [data])

    return (
        <form className='loginForm' onSubmit={handleLogin}>
            <input
                type="text"
                onChange={e => setEmail(e.target.value)}
                value={email}
                placeholder="Enter Email"
                required
            />
            <input
                type="text"
                onChange={e => setPassword(e.target.value)}
                value={password}
                placeholder="Enter Password"
                required
            />
            <input type="submit" value="Submit" />
        </form>
    )
}

export default Login
