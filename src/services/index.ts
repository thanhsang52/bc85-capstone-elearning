import axios from 'axios';

export const axiosCustom = axios.create({
  baseURL: 'https://apistore.cybersoft.edu.vn', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});