import axios from 'axios'
import { store } from '../redux/store'
axios.defaults.baseURL = "http://121.199.2.98:8000"

axios.interceptors.request.use(function (config) {
    store.dispatch({
        type: "change_loading",
        payload: true
    })
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    store.dispatch({
        type: "change_loading",
        payload: false
    })
    return response;
}, function (error) {
    return Promise.reject(error);
});