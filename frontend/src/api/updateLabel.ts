export const updateLabel = (id: number, label: number) => {
    return fetch(`/api/message/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ label, isChecked: true })
    });
}