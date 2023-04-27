import {
    sendMsgByPartner,
} from '../../api/PartnerApi'
import {
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
} from '../reducers/PartnerMessagesReducer'


// adding all messages to redux
export const addAllPartnerMessages = (allMsgs) => async (dispatch) => {
    dispatch(getAllPartnerMessagesStart())
    try{
        dispatch(getAllPartnerMessagesSuccess(allMsgs))
    }catch (error) {
        dispatch(getAllPartnerMessagesFailure("Could not Add all messages to redux"))
    }
}

// emptying messages data
export const emptyAllMessagesOfPartnerData = (data) => async (dispatch) => {
    try{
        dispatch(getMessagesDataEmpty(data))
    }catch (error) {
        dispatch(getAllPartnerMessagesFailure("Something went wrong, please try again."))
    }
}

// sending message
export const sendNewMessage = (messageBody) => async (dispatch) => {
    dispatch(isGetSendingPartnerMessageError())
    try{
        const {data} = await sendMsgByPartner(messageBody);
        if(data?.success === true){
            dispatch(addNewMessageToChat(data?.NewMessage));
        }else{
            dispatch(isGetSendingPartnerMessage(data?.message))
        }
    }catch (error) {
        dispatch(isGetSendingPartnerMessage("Could Not Send Message, Please Tru again"))
    }
}

// adding new message to list received from sender
export const appendNewMessageToList = (messageBody) => async (dispatch) => {
    dispatch(isGetNewMessage())
    try{
        dispatch(addNewMessageToChatFromSender(messageBody))
        //dispatch(isGetNewMessageEnd())
    }catch (error) {
        dispatch(isGetSendingPartnerMessage("Could Not Send Message, Please Tru again"))
    }
}

// ending getting new message
export const endGettingNewMsg = (messageBody) => async (dispatch) => {
    //dispatch(isGetNewMessage())
    try{
        //dispatch(addNewMessageToChatFromSender(messageBody))
        dispatch(isGetNewMessageEnd())
    }catch (error) {
        dispatch(isGetSendingPartnerMessage("Could Not Send Message, Please Tru again"))
    }
}

