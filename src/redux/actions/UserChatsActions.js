import {
    getAllConversationsOfACustomer,
    markAllUnReadMessagesAsReadCustomer
} from '../../api/CustomerApi'
import {
    getAllCustomerChatsStart,
    getAllCustomerChatsSuccess,
    getAllCustomerChatsFailure,
    getChatsDataEmpty,
    updateConversationLastMsg,
    markingAllUnReadMessagesCountAsZero,
    updateUnreadMessagesCount
} from '../reducers/CustomerChatsReducer'


// getting all chats on reload
export const getAllMyChats = () => async (dispatch) => {
    dispatch(getAllCustomerChatsStart())
    try{
        const {data} = await getAllConversationsOfACustomer();
        if(data?.success === true){
            dispatch(getAllCustomerChatsSuccess(data?.AllChats))
        }else{
            dispatch(getAllCustomerChatsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getAllCustomerChatsFailure("Could not get all Your Chats"))
    }
}

// getting new chats on getting back to screen
export const getAllMyChatsWithOutRefreshing = () => async (dispatch) => {
    //dispatch(getAllCustomerChatsStart())
    try{
        const {data} = await getAllConversationsOfACustomer();
        if(data?.success === true){
            dispatch(getAllCustomerChatsSuccess(data?.AllChats))
        }else{
            dispatch(getAllCustomerChatsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getAllCustomerChatsFailure("Could not get all Your Chats"))
    }
}

// emptying forums data
export const emptyAllChatsOfCustomerData = (data) => async (dispatch) => {
    try{
        dispatch(getChatsDataEmpty(data))
    }catch (error) {
        dispatch(getAllCustomerChatsFailure("Something went wrong, please try again."))
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
        dispatch(getAllCustomerChatsFailure("Something went wrong, please try again."))
    }
}

// updating un read count of chat
export const updateUnReadCountOfChat = (userId) => async (dispatch) => {
    console.log("userId: ",userId)
    try{
        dispatch(updateUnreadMessagesCount(userId))
    }catch (error) {
        dispatch(getAllCustomerChatsFailure("Something went wrong, please try again."))
    }
}

// updating un read messages count of user
export const markAllUnReadMessagesAsRead = (userId) => async (dispatch) => {
    try{
        const {data} = await markAllUnReadMessagesAsReadCustomer(userId);
        if(data?.success === true){
            dispatch(markingAllUnReadMessagesCountAsZero(userId))
        }else{

        }
    }catch (error) {
        dispatch(getAllCustomerChatsFailure("Could not mark all messages as Read"))
    }
}
