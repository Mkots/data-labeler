export const updateLabel = (message: {text: string, label: number}, label: number) => {
    return fetch(`/api/message`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            old: message,
            new: {...message, label: label, reviewed: true}
        })
    });
}