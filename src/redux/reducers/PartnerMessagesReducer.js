import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const partnerMessagesReducer = createSlice({
    name: "Partner Messages",
    initialState:{
        isPartnerMsgsFetching: false,
        isPartnerMsgSending: false,
        isGetPartnerMsgSendingError : "",
        isGetPartnerMsgsErrorMsg : "",
        allGetAllPartnerMsgsSuccess: false,
        AllPartnerMessages : [],
        isNewMsgSent : false,
        isNewMsgReceived : false
    },
    reducers: {
        getAllPartnerMessagesStart: (state, action) => {
            state.isPartnerMsgsFetching = true;
            state.AllPartnerMessages = []
            state.allGetAllPartnerMsgsSuccess = false;
            state.isGetPartnerMsgsErrorMsg = "";
        },
        getAllPartnerMessagesSuccess: (state, action) => {
            state.isPartnerMsgsFetching = false;
            state.allGetAllPartnerMsgsSuccess = true;
            state.AllPartnerMessages = action.payload;
        },
        isGetSendingPartnerMessage: (state, action) => {
            state.isPartnerMsgSending = true;
            state.isGetPartnerMsgSendingError = "";
            state.isNewMsgSent = false
        },
        // adding new message to current chat
        addNewMessageToChat: (state, action) => {
            state.isPartnerMsgSending = false;
            state.isGetPartnerMsgSendingError = "";

            // searching chat
            let newObj = {
                _id : action.payload._id,
                text: action.payload.msg,
                createdAt: action.payload.createdAt,
                user: {
                    _id: action.payload.senderId,
                },
            }
            let newArr = state.AllPartnerMessages
            let isFound = newArr.find(item => item.userId == action.payload.receiverId)
            if(isFound){
                isFound.messages.unshift(newObj)
                // updating
                newArr.filter(item => item.userId == newObj.user._id ? isFound : item)
            }
            state.isNewMsgSent = true
            state.AllPartnerMessages = newArr;
        },
        isGetNewMessage: (state, action) => {
            state.isNewMsgReceived = false
        },
        // adding new message to current chat received from sender
        addNewMessageToChatFromSender: (state, action) => {
            state.isPartnerMsgSending = false;
            state.isGetPartnerMsgSendingError = "";
            
            let newArr = state.AllPartnerMessages
            let isFound = newArr.find(item => item.userId == action.payload.user._id)
            if(isFound){
                isFound.messages.unshift(action.payload)
                // updating
                newArr.filter(item => item.userId == action.payload.user._id ? isFound : item)
            }
            state.AllPartnerMessages = newArr;
            state.isNewMsgReceived = true
        },
        isGetNewMessageEnd: (state, action) => {
            state.isNewMsgReceived = false
        },
        isGetSendingPartnerMessageError: (state, action) => {
            state.isPartnerMsgSending = false;
            state.isGetPartnerMsgSendingError = action.payload;
            state.isNewMsgSent = false
            toast.error(action.payload)
        },
        getAllPartnerMessagesFailure: (state, action) => {
            state.isPartnerMsgsFetching = false;
            state.isSignInError = true;
            state.isGetPartnerMsgsErrorMsg = action.payload;
            toast.error(action.payload)
        },
        // emptying all tickets
        getMessagesDataEmpty: (state, action) => {
            state.AllPartnerMessages = [];
        },
    }
});


export const { 
    getAllPartnerMessagesStart,
    getAllPartnerMessagesSuccess,
    getAllPartnerMessagesFailure,
    getMessagesDataEmpty,
    isGetSendingPartnerMessage,
    addNewMessageToChat,
    isGetSendingPartnerMessageError,
    addNewMessageToChatFromSender,
    isGetNewMessage,
    isGetNewMessageEnd
 } = partnerMessagesReducer.actions;
export default partnerMessagesReducer.reducer;