import {
    signInUser,
    getAllOrdersOfCustomer,
    updateProfile,
    postNewComplaint,
    postNewReview,
    cancelAnyOrderByCustomer,
    placeReOrder,
    signInUserWithGoogle
} from '../../api/CustomerApi'
import {
    loginStart,
    loginSuccess,
    loginFailure,
    logOutStart,
    logOutSuccess,
    logOutFailure,
    addingAppMenuStart,
    addingAppMenuSuccess,
    addingAppMenuFailure,
    removingFromAppMenuSuccess,
    addingCustomMenuStart,
    addingCustomMenuSuccess,
    removingFromCustomMenuSuccess,
    removingCustomMenuFailure,
    addingCustomMenuFailure,
    increaseQuantityInCustomMenu,
    decreaseQuantityInCustomMenu,
    emptyingCustomMenu,
    gettingAllOrdersStart,
    gettingAllOrdersSuccess,
    addMoreOrdersSuccess,
    gettingMoreOrdersFailure,
    increaseQuantityInAppMenu,
    decreaseQuantityInAppMenu,
    removingAnyMenuFromAppMenus,
    profileGettingStart,
    profileGettingSuccess,
    profileGettingFailure,
    gettingAllOrdersEmpty,
    addComplaintOnAnyOrder,
    addRatingOnAnyOrder,
    cancellingAnyOrder,
    makeNewReorder,
    acceptOrDeclineAnyOrder,
    addingNewAppMenuSuccess,
    increaseMenuQuantityInAppMenu,
    decreaseMenuQuantityInAppMenu,
    decreaseNewMenuQuantityInAppMenu,
    hideModalForDiffRestaurant,
    addingAppMenuSuccessForMenuDetails
} from '../reducers/UserReducer'
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

// logging in
export const LogInUser = (userData) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await signInUser(userData);
        if(data?.success === true){
            // event which trigers when user connection becomes connected
            //socket.emit("newPartnerConnected", data?.User);
            dispatch(loginSuccess(data?.User))
        }else{
            dispatch(loginFailure(data?.message))
        }
    }catch (error) {
        dispatch(loginFailure("Could Not Sign In, Please try again"))
    }
}

// logging in with google
export const LogInUserWithGoogle = (userData) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await signInUserWithGoogle(userData);
        if(data?.success === true){
            dispatch(loginSuccess(data?.User))
        }else{
            dispatch(loginFailure(data?.message))
        }
    }catch (error) {
        dispatch(loginFailure("Could Not Sign In, Please try again"))
    }
}

// logging out
export const LogOutUser = () => async (dispatch) => {
    const cookies = new Cookies();
    dispatch(logOutStart())
    try{
        cookies.remove("fiveChefsCustomerToken")
        cookies.remove("fiveChefsCustomerTempToken")

        // socket.emit('disconnect', function(){
        //     console.log("disconnect event caught in client side")
        // });
        dispatch(logOutSuccess())
    }catch (error) {
        dispatch(logOutFailure("Could Not Log out"))
        //toast.error("Could Not Sign Out.");
    }
}

// adding app menu to cart
export const addAppMenuToCart = (menuData) => async (dispatch) => {
    dispatch(addingAppMenuStart())
    try{
        dispatch(addingAppMenuSuccess(menuData))
    }catch (error) {
        console.log("error in adding menu to cart and error is : ", error)
        dispatch(addingAppMenuFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// adding app menu to cart from menu details
export const addAppMenuToCartForMenuDetails = (menuData) => async (dispatch) => {
    dispatch(addingAppMenuStart())
    try{
        dispatch(addingAppMenuSuccessForMenuDetails(menuData))
    }catch (error) {
        console.log("error in adding menu to cart and error is : ", error)
        dispatch(addingAppMenuFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// duplicating app menu to cart
export const duplicateAppMenuToCart = (menuData) => async (dispatch) => {
    dispatch(addingAppMenuStart())
    try{
        dispatch(addingNewAppMenuSuccess(menuData))
    }catch (error) {
        console.log("error in adding menu to cart and error is : ", error)
        dispatch(addingAppMenuFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// decreasing quantity from app menu from cart
export const removeAppMenuFromCart = (menuData) => async (dispatch) => {
    dispatch(addingAppMenuStart())
    try{
        dispatch(decreaseMenuQuantityInAppMenu(menuData))
    }catch (error) {
        dispatch(addingAppMenuFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// decreasing quantity from app menu from cart
export const removeNewAppMenuFromCart = (menuData) => async (dispatch) => {
    console.log("menuData : ",menuData)
    dispatch(addingAppMenuStart())
    try{
        dispatch(decreaseNewMenuQuantityInAppMenu(menuData))
    }catch (error) {
        dispatch(addingAppMenuFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// removing app menu from cart
export const deleteAppMenuFromCart = (menuData) => async (dispatch) => {
    dispatch(addingAppMenuStart())
    try{
        dispatch(removingFromAppMenuSuccess(menuData))
    }catch (error) {
        dispatch(addingAppMenuFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// adding custom menu to cart
export const addCustomMenuToCart = (menuData) => async (dispatch) => {
    dispatch(addingCustomMenuStart())
    try{
        dispatch(addingCustomMenuSuccess(menuData))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// removing custom menu from cart
export const removeCustomMenuFromCart = (menuData) => async (dispatch) => {
    dispatch(addingCustomMenuStart())
    try{
        dispatch(removingFromCustomMenuSuccess(menuData))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(removingCustomMenuFailure("Could Not Remove Menu to Cart, Please try again"))
    }
}

// increasing quantity of any product in custom menu
export const increaseQtyOfAnyProductInCustomMenu = (id) => async (dispatch) => {
    try{
        dispatch(increaseQuantityInCustomMenu(id))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not add More Quantity to Cart, Please try again"))
    }
}

// decreasing quantity of any product in custom menu
export const decreaseQtyOfAnyProductInCustomMenu = (id) => async (dispatch) => {
    try{
        dispatch(removingFromCustomMenuSuccess(id))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not add More Quantity to Cart, Please try again"))
    }
}

// decreasing quantity of any product in custom menu
export const decreaseQtyOfAnyProductInCustomMenuNew = (id) => async (dispatch) => {
    console.log("id ===> : ", id)
    try{
        dispatch(decreaseQuantityInCustomMenu(id))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not add More Quantity to Cart, Please try again"))
    }
}

// emptying custom menu
export const emptyingMyCustomMenu = () => async (dispatch) => {
    try{
        dispatch(emptyingCustomMenu())
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not Empty Your Custom Menu, Please try again"))
    }
}

// getting all orders for first time
export const getAllOrders = () => async (dispatch) => {
    dispatch(gettingAllOrdersStart())
    try{
        const {data} = await getAllOrdersOfCustomer();
        console.log("All orders : ", data)
        if(data?.success === true){
            dispatch(gettingAllOrdersSuccess(data?.AllOrders))
        }else{
            dispatch(gettingMoreOrdersFailure("Upper Could Not get All Orders, Please try again"))
        }
    }catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// adding new orders to previous array
export const appendMoreOrders = (orderData) => async (dispatch) => {
    try{
        dispatch(addMoreOrdersSuccess(orderData))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(gettingMoreOrdersFailure("Could Not get All Orders, Please try again"))
    }
}

// increasing quantity of any product in app menu
export const increaseQtyOfAnyProductInAppMenu = (menuId , prodId) => async (dispatch) => {
    try{
        dispatch(increaseQuantityInAppMenu({menuId , prodId}))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not add More Quantity to Cart, Please try again"))
    }
}

// decreasing quantity of any product in app menu
export const decreaseQtyOfAnyProductInAppMenu = (menuId , prodId) => async (dispatch) => {
    try{
        dispatch(decreaseQuantityInAppMenu({menuId , prodId}))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not add More Quantity to Cart, Please try again"))
    }
}

// removing any menu from app menus after order placing
export const removeAnyMenuFromAppMenu = (id) => async (dispatch) => {
    dispatch(gettingAllOrdersStart())
    try{
        const {data} = await getAllOrdersOfCustomer();
        if(data?.success === true){
            dispatch(gettingAllOrdersSuccess(data?.AllOrders))
        }else{
            dispatch(gettingMoreOrdersFailure("Upper Could Not get All Orders, Please try again"))
        }
        dispatch(removingAnyMenuFromAppMenus(id))
    }catch (error) {
        console.log("error is : ", error)
        dispatch(addingCustomMenuFailure("Could Not Empty Your Custom Menu, Please try again"))
    }
}

// updating profile
export const updateMyProfile = (userData) => async (dispatch) => {
    dispatch(profileGettingStart())
    console.log("data sent : ", userData)
    try{
        const {data} = await updateProfile(userData);
        if(data?.success === true){
            dispatch(profileGettingSuccess(data?.UpdatedProfile))
        }else{
            dispatch(profileGettingFailure(data?.message))
        }
    }catch (error) {
        dispatch(profileGettingFailure("Could Not Update profile, Please try again"))
    }
}

// emptying all orders 
export const emptyAllGotOrders = () => async (dispatch) => {
    dispatch(gettingAllOrdersStart())
    try{
        dispatch(gettingAllOrdersEmpty())
    }catch (error) {
        dispatch(gettingMoreOrdersFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// hide replace restaurant menu
export const hideReplaceRestaurant = () => async (dispatch) => {
    try{
        dispatch(hideModalForDiffRestaurant())
    }catch (error) {
        dispatch(gettingMoreOrdersFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// adding complaint on any order 
export const addComplaintToAnyOrder = (sendata) => async (dispatch) => {
    try{
        const {data} = await postNewComplaint(sendata);
        if(data?.success === true){
            dispatch(addComplaintOnAnyOrder(data?.NewOrderObject ))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        dispatch(gettingMoreOrdersFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// adding review on any order 
export const addReviewToAnyOrder = (sendata) => async (dispatch) => {
    try{
        const {data} = await postNewReview(sendata);
        if(data?.success === true){
            dispatch(addRatingOnAnyOrder(data))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        dispatch(gettingMoreOrdersFailure("Could Not add Menu to Cart, Please try again"))
    }
}

// cancel any order from customer
export const cancelSingleOrder = (id) => async (dispatch) => {
    try{
        const {data} = await cancelAnyOrderByCustomer( id);
        if(data?.success === true){
            dispatch(cancellingAnyOrder(id))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        dispatch(gettingMoreOrdersFailure("Could Not Cancel, Please try again"))
    }
}

// make re order
export const makeReOrderOfAnyOrder = (id , dataGot) => async (dispatch) => {
    let newId = id;
    let newData = dataGot
    try{
        const {data} = await placeReOrder(newId , newData);
        if(data?.success === true){
            dispatch(makeNewReorder(data?.NewOrder))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        console.log("Error while placing Re Order: ", error)
        dispatch(gettingMoreOrdersFailure("Could Not Place New Order, Please try again"))
    }
}

// accept or decline any order from partner
export const acceptOrDenySpecificOrderFromOwner = (id , status) => async (dispatch) => {
    try{
        dispatch(acceptOrDeclineAnyOrder({orderId : id , status : status}))
    }catch (error) {
        console.log("Error while placing Re Order: ", error)
        dispatch(gettingMoreOrdersFailure("Could Not Place New Order, Please try again"))
    }
}

