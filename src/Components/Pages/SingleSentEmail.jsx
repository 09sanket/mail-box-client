import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import axios from 'axios'
const SingleSentEmail = () => {
    const url = useParams();
    const [singleMail, setSingleMail] = useState({});

    useEffect(() => {
        const getSingleMail = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('token'));
                let response = await axios.get(`https://mail-box-1-d23c1-default-rtdb.firebaseio.com/mailcompose.json/${url.id}`, { headers: { "Authorization": token } })
               
                setSingleMail(response.data.data)
            } catch (error) {
                console.log(error);
            }
        }
        getSingleMail();
    }, [url.id])
    

    return <div className=' w-[80%] mx-auto md:w-[60%] my-3 min-h-[700px] flex flex-col  border p-3'>
        <div className=' md:text-2xl my-2 md:my-3 '>
            <div className='p-2'>
                <span className='border-4 rounded-lg p-1 '>Sent To : </span>
            </div>
            <div className='p-2'>
                <span className='border-4 p-1 border-gray-400 rounded-xl '>{singleMail.receiver}</span>
            </div>
        </div>
        <div className=' md:text-2xl my-2 md:my-3 '>
            <div className='p-2'>
                <span className='border-4 rounded-lg p-1 '>Subject : </span>
            </div>
            <div className='p-2'>
                <span className='border-4 p-1 border-gray-400 rounded-xl '>{singleMail.subject}</span>
            </div>
        </div>
        <div className='flex flex-col md:text-2xl my-2 md:my-3  flex-grow  '>
            <div className='p-2 '>
                <span className='border-4 rounded-lg p-1 '>body : </span>
            </div>
            <div className=' mt-3 p-2 bg-gray-400 text-gray-100 rounded-xl flex-grow'>
                <div className='p-2  '>{singleMail.body}</div>
            </div>
        </div>

    </div>
}

export default SingleSentEmail