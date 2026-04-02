import  BannerController  from '@/controllers/banners-controller';
import React,{useState,useMemo} from 'react'
import { useQuery } from '@tanstack/react-query';

export default function useBanners() {
    const [searchQuery, setSearchQuery] = useState('');

     const { data: banners, isLoading } = useQuery({
        queryKey: ['banners'],
        queryFn: BannerController.getBanners,
    });



    const filteredItems = useMemo(() => {
            if (!banners) return [];
            if (!searchQuery.trim()) return banners;
            const q = searchQuery.toLowerCase();
            return banners.filter((b: any) =>
                b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q)
            );
        }, [banners, searchQuery]);
    
        /* ================= STATS ================= */
        const totalBanners = banners?.length ?? 0;
        const publishedCount = banners?.filter((b: any) => b.is_published).length ?? 0;
        const unpublishedCount = totalBanners - publishedCount;
  return {
    banners,
    isLoading,
    searchQuery,
    setSearchQuery,
    filteredItems,
    totalBanners,
    publishedCount,
    unpublishedCount,
  }
}
