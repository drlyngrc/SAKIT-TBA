/*=============== SHOW HIDE PASSWORD LOGIN ===============*/
const passwordLogin = (loginPass, loginEye) => {
    const input = document.getElementById(loginPass), 
        iconEye = document.getElementById(loginEye)

    iconEye.addEventListener('click', () => {
        input.type === 'password' ? input.type = 'text'
                                : input.type = 'password'

        iconEye.classList.toggle('ri-eye-fill')
        iconEye.classList.toggle('ri-eye-off-fill')
        
    })
}

passwordLogin('password','loginPassword')

/*=============== SHOW HIDE PASSWORD CREATE ACCOUNT ===============*/
const passwordRegister = (loginPass, loginEye) => {
    const input = document.getElementById(loginPass), 
        iconEye = document.getElementById(loginEye)

    iconEye.addEventListener('click', () => {
        input.type === 'password' ? input.type = 'text'
                                : input.type = 'password'

        iconEye.classList.toggle('ri-eye-fill')
        iconEye.classList.toggle('ri-eye-off-fill')
        
    })
}

passwordRegister('passwordCreate','loginPasswordCreate')

/*=============== SHOW HIDE LOGIN & CREATE ACCOUNT ===============*/
const loginAccessRegister = document.getElementById('loginAccessRegister'),
    buttonRegister = document.getElementById('loginButtonRegister')
    buttonLogin = document.getElementById('loginButtonAccess')

buttonRegister.addEventListener('click', () => {
    loginAccessRegister.classList.add('active')
})

buttonLogin.addEventListener('click', () => {
    loginAccessRegister.classList.remove('active')
})
