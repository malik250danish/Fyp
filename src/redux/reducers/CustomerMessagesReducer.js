import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const userMessagesReducer = createSlice({
    name: "Customer Messages",
    initialState:{
        isCustomerMsgsFetching: false,
        isCustomerMsgSending: false,
        isGetCustomerMsgSendingError : "",
        isGetCustomerMsgsErrorMsg : "",
        allGetAllCustomerMsgsSuccess: false,
        AllCustomerMessages : [],
        isNewMsgSent : false,
        isNewMsgReceived : false
    },
    reducers: {
        getAllCustomerMessagesStart: (state, action) => {
            state.isCustomerMsgsFetching = true;
            state.AllCustomerMessages = []
            state.allGetAllCustomerMsgsSuccess = false;
            state.isGetCustomerMsgsErrorMsg = "";
        },
        getAllCustomerMessagesSuccess: (state, action) => {
            state.isCustomerMsgsFetching = false;
            state.allGetAllCustomerMsgsSuccess = true;
            state.AllCustomerMessages = action.payload;
        },
        isGetSendingCustomerMessage: (state, action) => {
            state.isCustomerMsgSending = true;
            state.isGetCustomerMsgSendingError = "";
            state.isNewMsgSent = false
        },
        // adding new message to current chat
        addNewMessageToChat: (state, action) => {
            state.isCustomerMsgSending = false;
            state.isGetCustomerMsgSendingError = "";

            // searching chat
            let newObj = {
                _id : action.payload._id,
                text: action.payload.msg,
                createdAt: action.payload.createdAt,
                user: {
                    _id: action.payload.senderId,
                },
            }
            let newArr = state.AllCustomerMessages
            let isFound = newArr.find(item => item.userId == action.payload.receiverId)
            if(isFound){
                isFound.messages.unshift(newObj)
                // updating
                newArr.filter(item => item.userId == newObj.user._id ? isFound : item)
            }
            state.isNewMsgSent = true
            state.AllCustomerMessages = newArr;
        },
        isGetNewMessage: (state, action) => {
            state.isNewMsgReceived = false
        },
        // adding new message to current chat received from sender
        addNewMessageToChatFromSender: (state, action) => {
            state.isCustomerMsgSending = false;
            state.isGetCustomerMsgSendingError = "";
            
            let newArr = state.AllCustomerMessages
            let isFound = newArr.find(item => item.userId == action.payload.user._id)
            if(isFound){
                isFound.messages.unshift(action.payload)
                // updating
                newArr.filter(item => item.userId == action.payload.user._id ? isFound : item)
            }
            state.AllCustomerMessages = newArr;
            state.isNewMsgReceived = true
        },
        isGetNewMessageEnd: (state, action) => {
            state.isNewMsgReceived = false
        },
        isGetSendingCustomerMessageError: (state, action) => {
            state.isCustomerMsgSending = false;
            state.isGetCustomerMsgSendingError = action.payload;
            state.isNewMsgSent = false
            toast.error(action.payload)
        },
        getAllCustomerMessagesFailure: (state, action) => {
            state.isCustomerMsgsFetching = false;
            state.isSignInError = true;
            state.isGetCustomerMsgsErrorMsg = action.payload;
            toast.error(action.payload)
        },
        // emptying all tickets
        getMessagesDataEmpty: (state, action) => {
            state.AllCustomerMessages = [];
        },
    }
});


export const { 
    getAllCustomerMessagesStart,
    getAllCustomerMessagesSuccess,
    getAllCustomerMessagesFailure,
    getMessagesDataEmpty,
    isGetSendingCustomerMessage,
    addNewMessageToChat,
    isGetSendingCustomerMessageError,
    addNewMessageToChatFromSender,
    isGetNewMessage,
    isGetNewMessageEnd
 } = userMessagesReducer.actions;
export default userMessagesReducer.reducer;