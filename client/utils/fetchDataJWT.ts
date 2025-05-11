const fetchDataJWT = async (url: URL, jwt:string|null )=>{
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${jwt}`,
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        let data = await response.json()

        if(data.data)
            data = data.data

        return data
    } catch(error) {
        console.error(error)
        throw new Error(`An error occured while fetching data`)
    }
}

export default fetchDataJWT