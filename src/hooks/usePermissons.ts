import { useAuth } from '../hooks/useAuth';

export const usePermissions = () => {
    const { role, permissions } = useAuth();
    
    const hasPermission = (requiredPermissions: string ): boolean => {
        if (role === 'super_admin') {
            return true
        }
        return permissions?.includes(requiredPermissions) ?? false
    };

    return { hasPermission };
}