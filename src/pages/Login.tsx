import Logo from '../assets/react.svg'

function Login () {
    return (
      <>

        <div className=''>
            <img src={Logo} alt='Logo image'/>
            <form action={postMessage}>
                <input type="text" placeholder='Username'/>
                <input type="password" placeholder='Password'/>
                <input type="button" value="Login" />
            </form>
        </div>
      </>
    )
}

export default Login