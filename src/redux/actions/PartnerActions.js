import {
    signInPartner,
} from '../../api/CommonApi'
import { updatePartnerProfile } from "../../api/PartnerApi"
import {
    getAllOrdersOfAnyPartner,
    getAllRecentOrdersOfAnyPartner,
    updateSingleOrderStatus
} from '../../api/PartnerApi'
import {
    partnerLoginStart,
    partnerLoginSuccess,
    partnerLoginFailure,
    partnerLogOutStart,
    partnerLogOutSuccess,
    partnerLogOutFailure,
    gettingAllOrdersStart,
    gettingAllOrdersSuccess,
    addMoreOrdersSuccess,
    gettingMoreOrdersFailure,
    changeStatusOfAnyOrderSuccess,
    gettingAllRecentOrdersStart,
    gettingAllRecentOrdersSuccess,
    addMoreRecentOrdersSuccess,
    gettingMoreRecentOrdersFailure,
    gettingAllRecentOrdersEmpty,
    gettingAllOrdersEmpty,
    changeStatusOfAnyAllOrderSuccess,
    addOneRecentOrdersSuccess,
    changeStatusOfCancelledOrderByCustomer,
    profileGettingStart,
    profileGettingSuccess,
    profileGettingFailure
} from '../reducers/PartnerReducer'
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
var connectionOptions = {
    "force new connection": true,
    "reconnectionAttempts": "Infinity",
    "timeout": 10000,
    "transports": ["websocket"]
};
const socket = io.connect('https://fivechefapp.cyclic.app', connectionOptions);


// logging in
export const LogInPartner = (userData) => async (dispatch) => {
    dispatch(partnerLoginStart())
    try {
        const res = await signInPartner(userData);
        console.log("partner : ", res)
        if (res?.data?.success === true) {
            socket.emit("newPartnerConnected", res?.data?.User);
            dispatch(partnerLoginSuccess(res?.data?.User))
        } else {
            dispatch(partnerLoginFailure(res?.data?.message))
        }
    } catch (error) {
        dispatch(partnerLoginFailure("Could Not Sign In, Please try again"))
    }
}

// logging out
export const LogOutPartner = () => async (dispatch) => {
    dispatch(partnerLogOutStart())
    const cookies = new Cookies();
    try {
        socket.emit('disconnect', function () {
            console.log("disconnect event caught in client side")
        });
        cookies.remove("fiveChefsPartnerToken")
        cookies.remove("fiveChefsPartnersTempToken")
        dispatch(partnerLogOutSuccess())
    } catch (error) {
        //dispatch(partnerLogOutFailure("Could Not Log out"))
    }
}

// getting all orders for first time
export const getAllOrdersOfPartner = () => async (dispatch) => {
    dispatch(gettingAllOrdersStart())
    try {
        const { data } = await getAllOrdersOfAnyPartner();
        if (data?.success === true) {
            dispatch(gettingAllOrdersSuccess(data?.AllOrders))
        } else {
            dispatch(gettingMoreOrdersFailure("Upper Could Not get All Orders, Please try again"))
        }
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// adding new orders to previous array
export const appendMoreOrdersOfPartner = (orderData) => async (dispatch) => {
    try {
        dispatch(addMoreOrdersSuccess(orderData))
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// changing status of any order
export const changeStatusOfAnyOrderByPartner = (id, status) => async (dispatch) => {
    try {
        dispatch(changeStatusOfAnyOrderSuccess({ Id: id, status: status }))
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not update status of order, Please try again"))
    }
}

// getting all orders for first time
export const getAllRecentOrdersOfPartner = () => async (dispatch) => {
    dispatch(gettingAllRecentOrdersStart())
    try {
        const { data } = await getAllRecentOrdersOfAnyPartner();
        if (data?.success === true) {
            dispatch(gettingAllRecentOrdersSuccess(data?.AllOrders))
        } else {
            dispatch(gettingMoreRecentOrdersFailure("Upper Could Not get All Orders, Please try again"))
        }
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreRecentOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// adding new orders to previous array
export const appendMoreRecentOrdersOfPartner = (orderData) => async (dispatch) => {
    try {
        dispatch(addMoreRecentOrdersSuccess(orderData))
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreRecentOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// adding new one order to previous array
export const appendOmeRecentOrdersOfPartner = (orderData) => async (dispatch) => {
    try {
        dispatch(addOneRecentOrdersSuccess(orderData))
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreRecentOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// emptying all recent orders for first time
export const getAllRecentOrdersOfPartnerEmpty = () => async (dispatch) => {
    dispatch(gettingAllRecentOrdersStart())
    try {
        dispatch(gettingAllRecentOrdersEmpty())
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreRecentOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// emptying all orders for first time
export const getAllOrdersOfPartnerEmpty = () => async (dispatch) => {
    dispatch(gettingAllOrdersStart())
    try {
        dispatch(gettingAllOrdersEmpty())
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// changing status of any order from all orders page
export const changeStatusOfAnyOrderFromAllOrderPage = (orderId, status) => async (dispatch) => {
    try {
        const dataGot = orderId;
        const { data } = await updateSingleOrderStatus(dataGot.id, dataGot.status);
        if (data?.success === true) {
            dispatch(changeStatusOfAnyAllOrderSuccess(orderId, status))
        } else {
            toast.error(data?.message)
        }
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not update status of order, Please try again"))
    }
}

// changing status of any order cancelled by customer all orders page
export const changeStatusOfAnyCancelledOrder = (orderId, status) => async (dispatch) => {
    try {
        dispatch(changeStatusOfCancelledOrderByCustomer({ orderId: orderId, status: status }))
    } catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not update status of order, Please try again"))
    }
}

// updating profile
export const updateMyProfile = (userData) => async (dispatch) => {
    dispatch(profileGettingStart())
    try {
        const { data } = await updatePartnerProfile(userData);
        console.log("data of response : ", data)
        if (data?.success === true) {
            dispatch(profileGettingSuccess(data?.UpdatedProfile))
        } else {
            dispatch(profileGettingFailure(data?.message))
        }
    } catch (error) {
        dispatch(profileGettingFailure("Could Not Update profile, Please try again"))
    }
}
