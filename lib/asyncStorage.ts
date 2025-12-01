import AsyncStorage from '@react-native-async-storage/async-storage';

const asyncStorage = () =>
{
    const setBearerToken = async (token: string) => await AsyncStorage.setItem('authToken', token);
    const getBearerToken = async () => await AsyncStorage.getItem('authToken');

    const setUserData = async (user: any) => await AsyncStorage.setItem('userData', JSON.stringify(user));
    const getUserData = async () =>
    {
        const userData = await AsyncStorage.getItem('userData') ?? null;
        return userData ? JSON.parse(userData) : userData;
    };

    const setCategoryId = async (categoryId: any) => await AsyncStorage.setItem('categoryId', JSON.stringify(categoryId));
    const getCategoryId = async () =>
    {
        const categoryId = await AsyncStorage.getItem('categoryId') ?? null;
        return categoryId ? JSON.parse(categoryId) : categoryId;
    };

    return {
        setBearerToken,
        getBearerToken,
        setUserData,
        getUserData,
        setCategoryId,
        getCategoryId
    }
};

export default asyncStorage;
