import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `https://quickcab.acuitysoftware.co.in/api`;

async function get(endpoint, params) {
    return request(endpoint, params, "GET");
}

async function post(endpoint, params) {
    return request(endpoint, params, "POST");
}

async function put(endpoint, params) {
    return request(endpoint, params, "PUT");
}

async function Delete(endpoint, params) {
    return request(endpoint, params, "DELETE");
}

async function request(endpoint, params = null, method = 'GET') {
    try {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (!token) {
            console.warn('Token is missing in AsyncStorage!');
        }

        // Construct the request URL
        const url = BASE_URL + endpoint;
        console.log('URL:----------------------------------------------------------------', url);
        console.log('Token:------------------------------------------------', token);

        // Define headers
        const headers = {
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
        };

        let body = null;

        // Check if params is FormData
        if (params instanceof FormData) {
            // When using FormData, do not set `Content-Type`, fetch will handle it automatically
            body = params;
        } else if (params) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(params);
        }

        // Execute the request
        const response = await fetch(url, {
            method,
            headers,
            body: method === 'GET' ? null : body,
        });

        // Parse the response
        const responseText = await response.text();
        const jsonResponse = responseText ? JSON.parse(responseText) : {};

        if (response.ok) {
            return jsonResponse;
        } else {
            throw jsonResponse;
        }
    } catch (error) {
        console.error('Request Error:', error);
        throw { error: 'Failed to process the request.', actError: error };
    }
}

const HttpClient = {
    get,
    post,
    put,
    Delete,
};

export default HttpClient;
