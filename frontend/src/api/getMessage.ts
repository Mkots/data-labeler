export const getMessage = () => {
    return fetch("/api/message").then((response) => response.json());
}