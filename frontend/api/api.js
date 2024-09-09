import http from './axios'

export const signIn = (value) => {
    return http.request({
        url: '/auth/sign-in',
        method: 'POST',
        data: value
    })
}

export const signUp = (value) => {
    return http.request({
        url: '/auth/sign-up',
        method: 'POST',
        data: value
    })
}

export const signOut = () => {
    return http.request({
        url: '/auth/sign-out',
        method: 'POST'
    })
}

export const getProfile = () => {
    return http.request({
        url: '/auth/profile',
        method: 'POST'
    })
}

