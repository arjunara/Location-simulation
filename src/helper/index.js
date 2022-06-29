import { useEffect, useState} from 'react';
import axios from 'axios';

const Apicall = ({method, url, body=null, headers=null})=> {
    const [apiResonse, setApiResponse] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const fetchApi = async()=> {
        try{
            const res = await axios[method](url, body, headers)
            const result = await res.data
            setApiResponse(result)
        }catch(err){
            console.log(err.message)
        }finally{
            setIsLoading(false)
        }
    }
    useEffect(()=> {
        fetchApi()
    }, [])
    return {apiResonse, isLoading}
}

export default Apicall