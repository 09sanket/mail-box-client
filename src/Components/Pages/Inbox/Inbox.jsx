import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { globalActions } from '../../Store/globalSlice';
import { AiOutlineDelete } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const Inbox = () => {
  const dispatch = useDispatch();
  const receivedMails = useSelector((state) => state.global.receivedMails);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllMails = async () => {
      try {
        let response = await axios.get('https://mail-box-1-d23c1-default-rtdb.firebaseio.com/mailcompose.json');
        if (response.data) {
          const mailsData = Object.values(response.data); // Convert object to array
          let count = 0;
          mailsData.forEach((item) => {
            if (item.opened === false) count++;
          });
    
          dispatch(globalActions.updateUnread(count));
          dispatch(globalActions.InboxFill(mailsData));
        }
      } catch (error) {
        console.log(error);
        toast.error('Could not fetch mails');
      }
    };
  
    const interval = setInterval(() => {
      getAllMails();
    }, 3000);
  
    return () => {
      clearInterval(interval);
    };
  }, []);
  

  let id;
  const MailDeleteHandler = async (e) => {
    try {
      e.preventDefault();
      console.log("Deleting email with ID:", id); // Add this line to check the id value
      const response = await axios.patch(`https://mail-box-1-d23c1-default-rtdb.firebaseio.com/mailcompose/${id}.json`, { isDeleted: true });
      console.log("API Response:", response.data); // Add this line to see the API response
      dispatch(globalActions.deleteMail(id));
    
      toast.success(response.data.msg);
    } catch (error) {
      console.log("Error:", error); // Add this line to see the error details
      toast.error(error.message || 'An error occurred');
    }
  };
  
  

  return (
    <div>
      {receivedMails && receivedMails.length > 0 ? (
        receivedMails.map((item) => (
          <div
            key={item._id}
            className={`rounded-2xl md:w-[80%] mx-auto p-2 flex justify-between border my-2 cursor-pointer ${
              item.opened === true ? 'bg-white' : 'bg-gray-300'
            }`}
          >
            <div
              className='flex truncate overflow-hidden overflow-ellipsis '
              onClick={(e) => {
                e.preventDefault();
                navigate(`/inboxMail/${item._id}`);
              }}
            >
              <div className='mr-4 flex justify-center items-center '>
                <img
                  className='min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] md:max-h-[70px] md:max-w-[70px] object-cover'
                  src='https://api-private.atlassian.com/users/9cea692d0a59c5e100680165cbbeb496/avatar'
                  alt=''
                />
              </div>
              <div className='flex flex-col'>
                <span className='text-gray-800 font-bold'>{item.sender}</span>
                <span className='text-gray-800 font-medium'>{item.subject}</span>
                <span className='text-gray-800'>{item.body}</span>
              </div>
            </div>
            
            <div
              className='text-4xl text-gray-500 p-2'
              onClick={(e) => {
                id = item._id;
                MailDeleteHandler(e);
              }}
            >
              <AiOutlineDelete />
            </div>
          </div>
        ))
      ) : (
        <div className='text-6xl text-gray-800 font-bold text-center w-[50%] mx-auto animate-bounce mt-[30%] '>
          <p>No emails available</p>
        </div>
      )}
    </div>
  );
};

export default Inbox;
