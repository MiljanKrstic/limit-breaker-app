import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import asyncStorage from '@/lib/asyncStorage';

const useAuthorizedFetch = () =>
{
    const router = useRouter();

    const {
        setBearerToken,
        getBearerToken
    } = asyncStorage();

    return useCallback(
        async (
            method: string,
            url: string,
            body?: any
        ) =>
        {
            try {
                const baseUrl = process.env.EXPO_PUBLIC_API_URL;
                const token = await getBearerToken();

                if (!token) {
                    await setBearerToken('');
                    router.push('/(auth)/login');

                    return {
                        ok: false,
                        status: 401,
                        body: null,
                        error: 'Bearer token not found.'
                    };
                }

                const response = await fetch(`${baseUrl}${url}`, {
                    method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: body ? JSON.stringify(body) : undefined
                });

                if (response.status === 401) {
                    await setBearerToken('');
                    router.push('/(auth)/login');

                    return {
                        ok: false,
                        status: 401,
                        body: null,
                        error: 'Unauthorized'
                    };
                }

                const json = await response.json();

                return {
                    ok: response.ok,
                    status: response.status,
                    body: json,
                    error: null
                };

            } catch (error: any) {
                return {
                    ok: false,
                    status: 500,
                    body: null,
                    error: error?.message ?? String(error)
                };
            }
        },
        [
            getBearerToken,
            setBearerToken,
            router
        ]
    );
};

export default useAuthorizedFetch;
