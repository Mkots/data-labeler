export const UploadCSV: React.FC = () => {
    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) =>{
        e.preventDefault()
        console.log('submitting', e)
        const formData = new FormData()
        // @ts-ignore
        const file = e.target[0].files[0]
        
        if (file) {
            formData.append('data.csv', file)
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            console.log(await res.text())
        }
    }

    return (
        <main className="container">
            <form onSubmit={handleSubmit} action="/upload" method="post" encType="multipart/form-data">
                <input type="file" name="data.csv" />
                <button type="submit">Submit</button>
            </form>
        </main>
    )
}