import React, { useRef, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Compose = () => {
  const receiverRef = useRef(null);
  const subjectRef = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const mailSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      let contentState = editorState.getCurrentContent();
      const contentPlainText = contentState.getPlainText();
      setEditorState(EditorState.createEmpty());
      const obj = {
        receiver: receiverRef.current.value,
        body: contentPlainText,
        subject: subjectRef.current.value,
        opened: false,
      };
      receiverRef.current.value = subjectRef.current.value = '';
      const response = await axios.post('https://mail-box-1-d23c1-default-rtdb.firebaseio.com/mailcompose.json', obj);

      toast.success(response.data.msg);
    } catch (error) {
      console.log(error);
      toast.error(error.message || 'An error occurred');
    }
  };

  const userEmail = localStorage.getItem('userEmail');

  return (
    <div>
      <form
        onSubmit={mailSubmitHandler}
        className='min-h-[800px] max-w-[600px] mx-auto border border-gray-300 rounded-md flex flex-col justify-evenly text-gray-500 md:text-2xl px-3'
      >
        <div className='flex justify-between '>
          <label htmlFor=''>From :</label>
          <label className='bg-white px-3'>{userEmail}</label>
        </div>
        <div className='flex justify-between'>
          <label htmlFor=''>To :</label>
          <input ref={receiverRef} className='overflow-hidden text-center' type='email'></input>
        </div>
        <div className='flex justify-between'>
          <label htmlFor=''>Sub :</label>
          <input ref={subjectRef} className='overflow-hidden text-center' type='text'></input>
        </div>
        <div>
          <label htmlFor=''>Compose Email :</label>
          <Editor
            wrapperClassName='wrapper-class'
            editorClassName='border bg-white min-h-[200px]'
            toolbarClassName='toolbar-class '
            onEditorStateChange={setEditorState}
            editorState={editorState}
          />
        </div>
        <button className='border p-2 lg:text-3xl bg-gray-300 active:bg-gray-500 active:text-gray-200'>Send</button>
      </form>
    </div>
  );
};

export default Compose;
