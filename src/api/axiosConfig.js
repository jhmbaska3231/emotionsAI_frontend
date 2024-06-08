import axios from 'axios';

// Configure and export axios object to make http requests to the api endpoint
// export default axios.create({
//     baseURL: 'http://emotionsai.us-east-1.elasticbeanstalk.com',
//     }
// });

// Create an instance of Axios with custom configuration
const instance = axios.create({
    baseURL: 'http://emotionsai.us-east-1.elasticbeanstalk.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
