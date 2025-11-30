import axios from "axios";



const AxiosInstance = new axios.create({
    baseURL:import.meta.env.VITE_BACKEND_ENDPOINT
})

export { AxiosInstance as Axioss}