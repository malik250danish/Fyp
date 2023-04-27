import {
    sendMsgByCustomer,
} from '../../api/CustomerApi'
import {
    getAllCustomerMessagesStart,
    getAllCustomerMessagesSuccess,
    getAllCustomerMessagesFailure,
    getMessagesDataEmpty,
    isGetSendingCustomerMessage,
    addNewMessageToChat,
    isGetSendingCustomerMessageError,
    isGetNewMessage,
    addNewMessageToChatFromSender,
    isGetNewMessageEnd
} from '../reducers/CustomerMessagesReducer'


// adding all messages to redux
export const addAllCustomerMessages = (allMsgs) => async (dispatch) => {
    dispatch(getAllCustomerMessagesStart())
    try{
        dispatch(getAllCustomerMessagesSuccess(allMsgs))
    }catch (error) {
        dispatch(getAllCustomerMessagesFailure("Could not Add all messages to redux"))
    }
}

// emptying messages data
export const emptyAllMessagesOfCustomerData = (data) => async (dispatch) => {
    try{
        dispatch(getMessagesDataEmpty(data))
    }catch (error) {
        dispatch(getAllCustomerMessagesFailure("Something went wrong, please try again."))
    }
}

// sending message
export const sendNewMessage = (messageBody) => async (dispatch) => {
    dispatch(isGetSendingCustomerMessage())
    try{
        const {data} = await sendMsgByCustomer(messageBody);
        if(data?.success === true){
            dispatch(addNewMessageToChat(data?.NewMessage));
        }else{
            dispatch(isGetSendingCustomerMessageError(data?.message))
        }
    }catch (error) {
        dispatch(isGetSendingCustomerMessageError("Could Not Send Message, Please Tru again"))
    }
}

// adding new message to list received from sender
export const appendNewMessageToList = (messageBody) => async (dispatch) => {
    dispatch(isGetNewMessage())
    try{
        dispatch(addNewMessageToChatFromSender(messageBody))
        //dispatch(isGetNewMessageEnd())
    }catch (error) {
        dispatch(isGetSendingCustomerMessageError("Could Not Send Message, Please Tru again"))
    }
}

// ending getting new message
export const endGettingNewMsg = (messageBody) => async (dispatch) => {
    //dispatch(isGetNewMessage())
    try{
        //dispatch(addNewMessageToChatFromSender(messageBody))
        dispatch(isGetNewMessageEnd())
    }catch (error) {
        dispatch(isGetSendingCustomerMessageError("Could Not Send Message, Please Tru again"))
    }
}

