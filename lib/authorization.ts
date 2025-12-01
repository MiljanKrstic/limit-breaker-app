import asyncStorage from '@/lib/asyncStorage';

export const register = async (form: {
    name: string;
    gender: string;
    date_of_birth: Date;
    email: string;
    password: string;
    password_confirmation: string;
}) =>
{
    try {
        const { setBearerToken, setUserData } = asyncStorage();

        const baseUrl = process.env.EXPO_PUBLIC_API_URL;

        const response = await fetch(`${baseUrl}register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        const json = await response.json();

        if (response.ok) {
            const token = json?.token;
            const user = json?.user;

            if (token) await setBearerToken(token);
            if (user) await setUserData(user);
        }

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
};

export const login = async (form: {
    email: string;
    password: string
}) =>
{
    try {
        const { setBearerToken, setUserData } = asyncStorage();

        const baseUrl = process.env.EXPO_PUBLIC_API_URL;

        const response = await fetch(`${baseUrl}login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });

        const json = await response.json();

        if (response.ok) {
            const token = json?.token;
            const user = json?.user;

            if (token) await setBearerToken(token);
            if (user) await setUserData(user);
        }

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
};
