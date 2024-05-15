/**Funcion para poner un timestamp como fecha amigable para el usuario */
export const useUserFriendlyTimeStamp = () => {
    const formatDate = (dateTimeStamp) => {
        const date = new Date(dateTimeStamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    return { formatDate };
}