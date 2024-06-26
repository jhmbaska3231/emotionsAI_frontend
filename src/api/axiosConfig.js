import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://emotionsai.us-east-1.elasticbeanstalk.com', // use this if custom domain is not configured
    baseURL: 'https://api.emotionsai.space',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setBearerToken = (token) => {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default instance;
