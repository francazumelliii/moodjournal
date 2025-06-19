import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

export default {
    async get(endpoint, params = {}) {
        const response = await api.get(endpoint, { params });
        return response.data;
    },

    // POST
    async post(endpoint, data) {
        const response = await api.post(endpoint, data);
        return response.data;
    },

    // PUT
    async put(endpoint, data) {
        const response = await api.put(endpoint, data);
        return response.data;
    },

    // DELETE
    async delete(endpoint) {
        const response = await api.delete(endpoint);
        return response.data;
    },
};
