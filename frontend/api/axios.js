import axios from 'axios';

const baseURL = 'https://eunnikoo-api.vercel.app:5001/api';

//Create a class to make axios instance and send request.

class HttpRequest {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    getInitConfig() {
        return {
            baseURL: this.baseURL,
            header: {},
            withCredentials: true  //TODO: Double check before deploy.
        }
    }

    intercept(inst){
        // Add a request interceptor
        inst.interceptors.request.use(function (config) {
            // Do something before request is sent
            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });

        // Add a response interceptor
        inst.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response;
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error
            return Promise.reject(error);
        });
    }

    request(options){
        options = { ...this.getInitConfig(), ...options };
        //Create an axios instance
        const inst = axios.create();
        this.intercept(inst);
        return inst(options)
    }
}

export default new HttpRequest(baseURL);


