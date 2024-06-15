import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://emotionsai.us-east-1.elasticbeanstalk.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setBearerToken = (token) => {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default instance;
