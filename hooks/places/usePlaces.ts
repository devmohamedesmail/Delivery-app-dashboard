import { config } from '@/constants/config'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function usePlaces() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['places'],
        queryFn: async () => {
            const response = await axios.get(`${config.API_URL}/places`)
            return response.data.data
        }
    })
    return { data, isLoading, error, refetch }
}