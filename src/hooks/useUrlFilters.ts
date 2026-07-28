import { useSearchParams } from 'react-router-dom';

// URL search params hook
export function useUrlFilters() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const getParam = (key: string, defaultValue: string = ""): string => {
        return searchParams.get(key) ?? defaultValue;
    }

    const updateParam = (key: string, value: string, defaultValues: string[] = ["All", ""]) => {
        setSearchParams((prev) => {
            const nextParams = new URLSearchParams(prev)

            if (!value || defaultValues.includes(value)) {
                nextParams.delete(key);
            } else {
                nextParams.set(key, value)
            }
            
            return nextParams;
        });
    };

    const clearAllFilters = () => {
      setSearchParams({});  
    };

    return { getParam, updateParam, clearAllFilters, searchParams};
}