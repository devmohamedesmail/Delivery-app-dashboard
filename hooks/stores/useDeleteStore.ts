import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import StoreController, { Store as StoreType } from '@/controllers/stores-controller'

export default function useDeleteStore() {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedStore, setSelectedStore] = useState<StoreType | null>(null)

      const deleteMutation = useMutation({
        mutationFn: StoreController.deleteStore,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stores'] })
            toast.success(t('stores.deleteSuccess'))
            setIsDeleteOpen(false)
            setSelectedStore(null)
        },
        onError: () => toast.error(t('stores.deleteError')),
    })

      function openDelete(store: StoreType) {
        setSelectedStore(store)
        setIsDeleteOpen(true)
    }
  return {
    deleteMutation,
    isDeleteOpen,
    setIsDeleteOpen,
    selectedStore,
    setSelectedStore,
    openDelete
  }
}
