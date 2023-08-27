
import { createSlice } from '@reduxjs/toolkit'
let intiState;
if (localStorage.getItem('isLogin')) {

    intiState = {
        isAuth: localStorage.getItem('isLogin'),
        receivedMails: [],
        unread:0
    }
}
else {
    intiState = {
        isAuth: false,
        receivedMails: [],
        unread:0
    }
}
const globalSlice = createSlice({
    name: 'global',
    initialState: intiState,
    reducers: {
        toggleAuth(state) {
            return { ...state, isAuth: !state.isAuth }

        },
        InboxFill(state, action) {

            return { ...state, receivedMails: action.payload };
        },
        updateUnread(state,action) {
            return {...state,unread:action.payload}
        },
        deleteMail(state, action) {
            let newMails = state.receivedMails.filter((mail) => {
                return mail._id!==action.payload
            })
            return {...state,receivedMails:newMails}
        }
        
    }

})

export const globalActions = globalSlice.actions;
export default globalSlice;
