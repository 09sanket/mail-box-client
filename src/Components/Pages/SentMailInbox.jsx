import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SentMailInbox = () => {
  const [Mails, setMails] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllMails = async () => {
      try {
        let response = await axios.get('https://mail-box-1-d23c1-default-rtdb.firebaseio.com/mailcompose.json');
        if (response.data) {
          const mailsData = Object.values(response.data); // Convert object to array
          setMails(mailsData);
        } else {
          setMails([]);
        }
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch mails');
      }
    };

    getAllMails();
  }, []);

  return (
    Mails && Mails.length > 0 ? (
      Mails.map((item) => (
        <div
          key={item._id}
          className={`rounded-2xl md:w-[80%] mx-auto p-2 flex justify-between border my-2 cursor-pointer bg-gray-300`}
        >
          <div
            className='flex truncate overflow-hidden'
            onClick={(e) => {
              e.preventDefault();
              navigate(`inboxSentMail/${item._id}`);
            }}
          >
            <div className='mr-4 flex justify-center items-center '>
              <img
                className='min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] md:max-h-[70px] md:max-w-[70px] object-cover'
                src="https://api-private.atlassian.com/users/9cea692d0a59c5e100680165cbbeb496/avatar"
                alt=""
              />
            </div>
            <div className='flex flex-col overflow-hidden'>
              <span className='text-gray-800 font-bold'>{item.sender}</span>
              <span className='text-gray-800 font-medium'>{item.subject}</span>
              <span className='text-gray-800 truncate '>{item.body}</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className='text-6xl text-gray-800 font-bold text-center w-[50%] mx-auto animate-bounce mt-[30%] '>
        <p>No emails available</p>
      </div>
    )
  );
};

export default SentMailInbox;
