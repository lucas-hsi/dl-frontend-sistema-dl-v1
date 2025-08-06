import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LayoutGestor from '../../components/layout/LayoutGestor';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function GestorIndexPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirecionar para o dashboard premium
        router.replace('/gestor/dashboard');
    }, [router]);

    return (
        <ProtectedRoute allowedRoles={['GESTOR']}>
            <LayoutGestor>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-2xl font-bold text-gray-800">Carregando Dashboard...</h2>
                        <p className="text-gray-600 mt-2">Redirecionando para o Dashboard Premium</p>
                    </div>
                </div>
            </LayoutGestor>
        </ProtectedRoute>
    );
} 