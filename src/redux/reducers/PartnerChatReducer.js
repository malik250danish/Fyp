import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const partnerChatsReducer = createSlice({
    name: "Partner Chats",
    initialState:{
        isAllPartnerChatsFetching: false,
        isGetAllPartnerChatsErrorMsg : "",
        isGetAllPartnerChatsSuccess: false,
        AllPartnerChats : [],
    },
    reducers: {
        getAllPartnerChatsStart: (state, action) => {
                state.isAllPartnerChatsFetching = true;
                state.AllPartnerChats = []
                state.isGetAllPartnerChatsSuccess = false;
                state.isGetAllPartnerChatsErrorMsg = "";
        },
        getAllPartnerChatsSuccess: (state, action) => {
            state.isAllPartnerChatsFetching = false;
            state.isGetAllPartnerChatsSuccess = true;
            let newArr = action.payload;
            newArr.sort(function(a,b){
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
            state.AllPartnerChats = newArr;
        },
        updateConversationLastMsg: (state, action) => {
            let newArr = state.AllPartnerChats
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
            state.AllPartnerChats = newArr;
        },
        updateUnreadMessagesCount: (state, action) => {
            let newArr = state.AllPartnerChats
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
            state.AllPartnerChats = newArr;
        },
        markingAllUnReadMessagesCountAsZero: (state, action) => {
            let newArr = state.AllPartnerChats
            let isFound = newArr.find(item => item.user._id == action.payload)
            if(isFound){
                isFound.unReadCount = 0

                // updating
                newArr.filter(item => item.user._id == action.payload ? isFound : item)
            }
            newArr.sort(function(a,b){
                return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
            })
            state.AllPartnerChats = newArr;
        },
        getAllPartnerChatsFailure: (state, action) => {
            state.isAllPartnerChatsFetching = false;
            state.isSignInError = true;
            state.isGetAllPartnerChatsErrorMsg = action.payload;
            toast.error(action.payload)
        },
        // emptying all tickets
        getChatsDataEmpty: (state, action) => {
            state.AllPartnerChats = [];
        },
    }
});


export const { 
    getAllPartnerChatsStart,
    getAllPartnerChatsSuccess,
    getAllPartnerChatsFailure,
    getChatsDataEmpty,
    updateConversationLastMsg,
    markingAllUnReadMessagesCountAsZero,
    updateUnreadMessagesCount
 } = partnerChatsReducer.actions;
export default partnerChatsReducer.reducer;