import http from './axios'

export const signIn = (value) => {
    return http.request({
        url: '/auth/sign-in',
        method: 'POST',
        data: value
    })
};

export const signUp = (value) => {
    return http.request({
        url: '/auth/sign-up',
        method: 'POST',
        data: value
    })
};

export const signOut = () => {
    return http.request({
        url: '/auth/sign-out',
        method: 'POST'
    })
};

export const getProfile = () => {
    return http.request({
        url: '/auth/profile',
        method: 'POST'
    })
};

export const createProduct = (value) => {
    return http.request({
        url: '/product/create',
        method: 'POST',
        data: value
    })
};

export const getAllProducts = () => {
    return http.request({
        url: '/product/',
        method: 'GET'
    })
};

export const deleteProductById = (id) => {
    return http.request({
        url: `/product/${id}`,
        method: 'DELETE'
    })
};

export const getProductById = (id) => {
    return http.request({
        url: `/product/${id}`,
        method: 'POST'
    })
}

export const updateProductById = (id, value) => {
    return http.request({
        url: `/product/update/${id}`,
        method: 'POST',
        data: value
    })
};

export const getGetPointRatio = () => {
    return http.request({
        url: '/points/points-get',
        method: 'GET'
    })
};

export const getRedeemPointRatio = () => {
    return http.request({
        url: '/points/points-redeem',
        method: 'GET'
    })
};

export const manageGetPointsRatio = (value) => {
    return http.request({
        url: '/points/points-get',
        method: 'POST',
        data:value
    })
};

export const manageRedeemPointsRatio = (value) => {
    return http.request({
        url: '/points/points-redeem',
        method: 'POST',
        data:value
    })
};

export const createCheckout = (value) => {
    return http.request({
        url: '/order/create-checkout-session',
        method: 'POST',
        data: value
    })
}