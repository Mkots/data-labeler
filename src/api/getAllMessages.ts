export const getAllMessages = () => {
    return fetch("/api/messages").then((response) => response.json());
}