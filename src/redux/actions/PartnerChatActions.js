import {
    getAllConversationsOfAPartner,
    markAllUnReadMessagesAsReadPartner
} from '../../api/PartnerApi'
import {
    getAllPartnerChatsStart,
    getAllPartnerChatsSuccess,
    getAllPartnerChatsFailure,
    getChatsDataEmpty,
    updateConversationLastMsg,
    markingAllUnReadMessagesCountAsZero,
    updateUnreadMessagesCount
} from '../reducers/PartnerChatReducer'


// getting all chats on reload
export const getAllMyChats = () => async (dispatch) => {
    dispatch(getAllPartnerChatsStart())
    try{
        const {data} = await getAllConversationsOfAPartner();
        if(data?.success == true){
            dispatch(getAllPartnerChatsSuccess(data?.AllChats))
        }else{
            dispatch(getAllPartnerChatsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getAllPartnerChatsFailure("Could not get all Your Chats"))
    }
}

// getting new chats on getting back to screen
export const getAllMyChatsWithOutRefreshing = () => async (dispatch) => {
    //dispatch(getAllPartnerChatsStart())
    try{
        const {data} = await getAllConversationsOfAPartner();
        if(data?.success === true){
            dispatch(getAllPartnerChatsSuccess(data?.AllChats))
        }else{
            dispatch(getAllPartnerChatsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getAllPartnerChatsFailure("Could not get all Your Chats In refreshing"))
    }
}

// emptying forums data
export const emptyAllChatsOfPartnerData = (data) => async (dispatch) => {
    try{
        dispatch(getChatsDataEmpty(data))
    }catch (error) {
        dispatch(getAllPartnerChatsFailure("Something went wrong, please try again."))
    }
}

// updating last message of chat
export const updateLastMessageOfChat = (userId , message) => async (dispatch) => {
    let newObj = {
        userId : userId,
        lastMessage : message
    }
    try{
        dispatch(updateConversationLastMsg(newObj))
    }catch (error) {
        dispatch(getAllPartnerChatsFailure("Something went wrong, please try again."))
    }
}

// updating un read count of chat
export const updateUnReadCountOfChat = (userId) => async (dispatch) => {
    try{
        dispatch(updateUnreadMessagesCount(userId))
    }catch (error) {
        dispatch(getAllPartnerChatsFailure("Something went wrong, please try again."))
    }
}

// updating un read messages count of user
export const markAllUnReadMessagesAsRead = (userId) => async (dispatch) => {
    try{
        const {data} = await markAllUnReadMessagesAsReadPartner(userId);
        if(data?.success === true){
            dispatch(markingAllUnReadMessagesCountAsZero(userId))
        }else{

        }
    }catch (error) {
        dispatch(getAllPartnerChatsFailure("Could not mark all messages as Read"))
    }
}
