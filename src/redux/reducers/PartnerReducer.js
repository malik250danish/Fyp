import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const userReducer = createSlice({
    name: "partner",
    initialState:{
        isPartnerSignInFetching: false,
        isPartnerSignInError : false,
        isPartnerSignInErrorMsg : "",
        isPartnerSignInSuccess: false,
        isPartnerSignOutSuccess: false,
        isPartnerSignOutFetching: false,
        isPartnerSignOutError : false,
        isPartnerSignOutErrorMsg : "",
        partnerNotificationCount: 0,
        partnerNotifications : [],
        partnerDetails : {},
        isPartnerOrdersFetching: false,
        isPartnerOrdersErrorMsg : "",
        isPartnerOrdersGettingSuccess: false,
        partnerOrders : [],
        isRecentOrdersFetching: false,
        isRecentOrdersErrorMsg : "",
        isRecentOrdersGettingSuccess: false,
        recentOrders : [],
        isProfileFetching : false,
        isProfileErrorMsg : ""
    },
    reducers: {
        partnerLoginStart: (state, action) => {
            state.isPartnerSignInFetching = true;
            state.isPartnerSignInError = false;
            state.isPartnerSignInErrorMsg = "";
            state.isPartnerSignInSuccess = false;
            state.partnerDetails = {}
        },
        partnerLoginSuccess: (state, action) => {
            state.isPartnerSignInFetching = false;
            state.isPartnerSignInSuccess = true;
            state.partnerDetails = action.payload;
            toast.success("Signed In As Partner SuccessFully")
        },
        partnerLoginFailure: (state, action) => {
            state.isPartnerSignInFetching = false;
            state.isPartnerSignInError = true;
            state.isPartnerSignInErrorMsg = action.payload;
            //toast.error(action.payload)
        },

        // logout
        partnerLogOutStart: (state, action) => {
            state.isPartnerSignOutFetching = true;
            state.isPartnerSignOutError = false;
            state.isPartnerSignOutErrorMsg = "";
            state.isPartnerSignInSuccess = false;
            state.isPartnerSignOutSuccess = false;
        },
        partnerLogOutSuccess: (state, action) => {
            state.isPartnerSignOutFetching = false;
            state.isPartnerSignOutSuccess = true;
            state.partnerDetails = {};
            toast.success("Signed Out SuccessFully")
        },
        partnerLogOutFailure: (state, action) => {
            state.isPartnerSignOutFetching = false;
            state.isPartnerSignOutSuccess = false;
            state.isPartnerSignOutError = true
            state.isPartnerSignOutErrorMsg = action.payload;
            toast.error(action.payload)
        },

        // orders
        gettingAllOrdersStart: (state, action) => {
            state.isPartnerOrdersFetching = true;
            state.isPartnerOrdersErrorMsg = "";
            state.isPartnerOrdersGettingSuccess= false
            state.partnerOrders = [];
        },
        gettingAllOrdersSuccess: (state, action) => {
           state.isPartnerOrdersFetching = false
           state.partnerOrders = action.payload;
           state.isPartnerOrdersGettingSuccess = true
        },
        gettingAllOrdersEmpty: (state, action) => {
            state.isPartnerOrdersFetching = false
            state.partnerOrders = [];
            state.isPartnerOrdersGettingSuccess = true
        },
        changeStatusOfAnyAllOrderSuccess: (state, action) => {
            let newArr = state.partnerOrders 
            let isFound = newArr.find(item => item._id == action.payload.id);
            if(isFound){
                // if status is pending
                if(action.payload.status === "Pending"){
                    isFound.orderStatus = "Order Placed"
                    isFound.isPending = true;
                    isFound.isAccepted = false;
                    isFound.isDelivered = false;
                    isFound.isCancelledByCustomer = false;
                    isFound.isCancelledByPartner = false;
                }

                // if status is Accepted
                if(action.payload.status === "Accepted"){
                    isFound.orderStatus = "Accepted"
                    isFound.isPending = false;
                    isFound.isAccepted = true;
                    isFound.isDelivered = false;
                    isFound.isCancelledByCustomer = false;
                    isFound.isCancelledByPartner = false;
                }

                // if status is declined
                if(action.payload.status === "Declined"){
                    isFound.orderStatus = "Declined"
                    isFound.isPending = false;
                    isFound.isAccepted = false;
                    isFound.isDelivered = false;
                    isFound.isCancelledByCustomer = false;
                    isFound.isCancelledByPartner = true;
                }

                // if status is Travelleing
                if(action.payload.status === "Traveling"){
                    isFound.orderStatus = "Traveling"
                    isFound.isPending = false;
                    isFound.isAccepted = true;
                    isFound.isDelivered = false;
                    isFound.isCancelledByCustomer = false;
                    isFound.isCancelledByPartner = false;
                }

                // if status is delivered
                if(action.payload.status === "Delivered"){
                    isFound.orderStatus = "Delivered"
                    isFound.isPending = false;
                    isFound.isAccepted = true;
                    isFound.isDelivered = true;
                    isFound.isCancelledByCustomer = false;
                    isFound.isCancelledByPartner = false;
                }
            }
            newArr.filter(item => item._id == action.payload.id ? isFound : item)
            if(action.payload.status === "Pending"){
                state.recentOrders.push(isFound);   
            }
            toast.success("Status Changed SuccessFully")
            state.partnerOrders = newArr;
            state.isPartnerOrdersGettingSuccess = true
        },
        // getting more order on scroll down
        addMoreOrdersSuccess: (state, action) => {
            state.orders.push(...action.payload);
        },
        gettingMoreOrdersFailure: (state, action) => {
            state.isPartnerOrdersFetching = true;
            state.isPartnerOrdersErrorMsg = action.payload;
            state.isPartnerOrdersGettingSuccess = false
            toast.error(action.payload)
        },

        // recent orders
        gettingAllRecentOrdersStart: (state, action) => {
            state.isRecentOrdersFetching = true;
            state.isRecentOrdersErrorMsg = "";
            state.isRecentOrdersGettingSuccess= false
            state.recentOrders = [];
        },
        gettingAllRecentOrdersSuccess: (state, action) => {
           state.isRecentOrdersFetching = false
           state.recentOrders = action.payload;
           state.isRecentOrdersGettingSuccess = true
        },
        gettingAllRecentOrdersEmpty: (state, action) => {
            state.isRecentOrdersFetching = false
            state.recentOrders = [];
            state.isRecentOrdersGettingSuccess = true
        },
        changeStatusOfAnyOrderSuccess: (state, action) => {
            let newArr = state.recentOrders 
            console.log("params : ", action.payload)
            let isFound = newArr.find(item => item._id == action.payload.Id);
            if(isFound){
                if(action.payload.status == true){
                    isFound.orderStatus = "Accepted"
                }else{
                    isFound.orderStatus = "Declined"
                }
            }
            newArr.filter(item => item._id == action.payload.Id ? isFound : item)
            state.recentOrders = newArr;
            // pushing accepted order to all orders array (if order has been accepted)
            if(isFound.orderStatus === "Accepted"){
                state.partnerOrders.unshift(isFound)
            }
            state.isRecentOrdersGettingSuccess = true
        },
        changeStatusOfCancelledOrderByCustomer: (state, action) => {
            const clonedObj = JSON.parse(JSON.stringify(state.recentOrders ))
            let newArr = clonedObj.map(item => item);
            let isFound = newArr.find(item => item._id == action.payload.orderId);
            if(isFound){
                if(action.payload.status == "Cancelled By Customer"){
                    console.log("inside of if")
                    isFound.isPending = false;
                    isFound.isAccepted = false;
                    isFound.isDelivered = false;
                    isFound.isCancelledByCustomer = true;
                    isFound.isCancelledByPartner = false;
                    isFound.orderStatus = action.payload.status
                }
                newArr.filter(item => item._id == action.payload.orderId ? isFound : item)
                state.recentOrders = newArr;
            }
            state.isRecentOrdersGettingSuccess = true
        },
        // getting more order on scroll down
        addMoreRecentOrdersSuccess: (state, action) => {
            state.recentOrders.push(...action.payload);
        },
        // getting more order on scroll down
        addOneRecentOrdersSuccess: (state, action) => {
            state.recentOrders.unshift(action.payload);
        },
        gettingMoreRecentOrdersFailure: (state, action) => {
            state.isRecentOrdersFetching = true;
            state.isRecentOrdersErrorMsg = action.payload;
            state.isRecentOrdersGettingSuccess = false
            toast.error(action.payload);
        },

        // profile updating
        profileGettingStart: (state, action) => {
            state.isProfileFetching = true;
            state.isProfileErrorMsg = "";
        },
        profileGettingSuccess: (state, action) => {
            state.isProfileFetching = false;
            state.partnerDetails = action.payload
            toast.success("Profile Updated SuccessFully");
        },
        profileGettingFailure: (state, action) => {
            state.isProfileFetching = false;
            state.isProfileErrorMsg = action.payload;
            toast.error(action.payload);
        },
        
    }
});


export const { 
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
 } = userReducer.actions;
export default userReducer.reducer;