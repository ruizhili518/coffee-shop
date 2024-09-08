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

export const getProfile = (value) => {
    return http.request({
        url: '/auth/profile',
        method: 'POST',
        data: value
    })
}