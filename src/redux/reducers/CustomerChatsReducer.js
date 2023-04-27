import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const userChatsReducer = createSlice({
    name: "Customer Chats",
    initialState:{
        isAllCustomerChatsFetching: false,
        isGetAllCustomerChatsErrorMsg : "",
        isGetAllCustomerChatsSuccess: false,
        AllCustomerChats : [],
    },
    reducers: {
        getAllCustomerChatsStart: (state, action) => {
            //if(AllCustomerChats?.length < 1){
                state.isAllCustomerChatsFetching = true;
                state.AllCustomerChats = []
                state.isGetAllCustomerChatsSuccess = false;
                state.isGetAllCustomerChatsErrorMsg = "";
            //}
        },
        getAllCustomerChatsSuccess: (state, action) => {
            state.isAllCustomerChatsFetching = false;
            state.isGetAllCustomerChatsSuccess = true;
            let newArr = action.payload;
            newArr.sort(function(a,b){
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
            state.AllCustomerChats = newArr;
        },
        updateConversationLastMsg: (state, action) => {
            let newArr = state.AllCustomerChats
            let isFound = newArr.find(item => item.user._id == action.payload.userId)
            if(isFound){
                isFound.lastMessage = action.payload.lastMessage
                isFound.updatedAt = action.payload.lastMessage.createdAt

                // updating
                newArr.filter(item => item.user._id == action.payload.userId ? isFound : item)
            }
            newArr.sort(function(a,b){
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
            state.AllCustomerChats = newArr;
        },
        updateUnreadMessagesCount: (state, action) => {
            let newArr = state.AllCustomerChats
            let isFound = newArr.find(item => item.user._id == action.payload)
            if(isFound){
                isFound.unReadCount += 1

                // updating
                newArr.filter(item => item.user._id == action.payload ? isFound : item)
            }
            // else{
            //     let newObj = {

            //     }
            // }
            newArr.sort(function(a,b){
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
            state.AllCustomerChats = newArr;
        },
        markingAllUnReadMessagesCountAsZero: (state, action) => {
            let newArr = state.AllCustomerChats
            let isFound = newArr.find(item => item.user._id == action.payload)
            if(isFound){
                isFound.unReadCount = 0

                // updating
                newArr.filter(item => item.user._id == action.payload ? isFound : item)
            }
            newArr.sort(function(a,b){
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
            state.AllCustomerChats = newArr;
        },
        getAllCustomerChatsFailure: (state, action) => {
            state.isAllCustomerChatsFetching = false;
            state.isSignInError = true;
            state.isGetAllCustomerChatsErrorMsg = action.payload;
            toast.error(action.payload)
        },
        // emptying all tickets
        getChatsDataEmpty: (state, action) => {
            state.AllCustomerChats = [];
        },
    }
});


export const { 
    getAllCustomerChatsStart,
    getAllCustomerChatsSuccess,
    getAllCustomerChatsFailure,
    getChatsDataEmpty,
    updateConversationLastMsg,
    markingAllUnReadMessagesCountAsZero,
    updateUnreadMessagesCount
 } = userChatsReducer.actions;
export default userChatsReducer.reducer;