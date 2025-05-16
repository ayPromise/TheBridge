import { useFetcher } from "react-router";

const useFetcherSubmit = () => {
    const fetcher = useFetcher();

    /**
     * 
     * @param payload any - the data you send
     * @param apiRoute string - the client route to send data
     */
    const submit = (payload:any, apiRoute:string)=>{
        fetcher.submit(JSON.stringify(payload),{
            method:"POST",
            action:apiRoute,
            encType: 'application/json',
        })
    }

    return {fetcher, submit}

}

export default useFetcherSubmit