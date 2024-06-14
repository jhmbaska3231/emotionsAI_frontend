import axios from 'axios';

// configure and export axios object to make http requests to the api endpoint
const instance = axios.create({
    baseURL: 'http://emotionsai.us-east-1.elasticbeanstalk.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
