// import { config } from '@/constants/config'
// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'


// export default function useAreas() {
//     const { data, isLoading, error, refetch } = useQuery({
//         queryKey: ['areas'],
//         queryFn: async () => {
//             const response = await axios.get(`${config.API_URL}/areas`)
//             return response.data
//         }
//     })


//     return { data, isLoading, error, refetch }
// }


import { config } from '@/constants/config'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function useAreas(
  page: number,
  search: string,
  placeFilter: string
) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['areas', page, search, placeFilter],

    queryFn: async () => {
      const response = await axios.get(`${config.API_URL}/areas`, {
        params: {
          page,
          search: search || undefined,
          place_id: placeFilter !== "all" ? placeFilter : undefined
        }
      })

      return response.data
    },

    placeholderData: (prev) => prev
  })

  return { data, isLoading, error, refetch }
}
