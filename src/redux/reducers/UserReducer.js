import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';


const userReducer = createSlice({
    name: "user",
    initialState:{
        isSignInFetching: false,
        isSignInError : false,
        isSignInErrorMsg : "",
        userSignInSuccess: false,
        userSignOutSuccess: false,
        isSignOutFetching: false,
        isSignOutError : false,
        isSignOutErrorMsg : "",
        notificationCount: 0,
        notifications : [],
        userDetails : {},
        isAppMenusFetching: false,
        isAppMenusRemovingSuccess: false,
        isAppMenusErrorMsg : "",
        isAppAddingMenusSuccess: false,
        appMenus : [],
        isCustomMenuFetching: false,
        isCustomMenuErrorMsg : "",
        isCustomMenuAddingSuccess: false,
        customMenu : [],
        isOrdersFetching: false,
        isOrdersErrorMsg : "",
        isOrdersGettingSuccess: false,
        orders : [],
        isProfileFetching: false,
        isProfileErrorMsg : "",
        differentRestaurant : false
    },
    reducers: {
        loginStart: (state, action) => {
            state.isSignInFetching = true;
            state.isSignInError = false;
            state.isSignInErrorMsg = "";
            state.userSignInSuccess = false;
            state.userDetails = {}
        },
        loginSuccess: (state, action) => {
            state.isSignInFetching = false;
            state.userSignInSuccess = true;
            state.userDetails = action.payload;
            toast.success("Signed In SuccessFully");
        },
        loginFailure: (state, action) => {
            state.isSignInFetching = false;
            state.isSignInError = true;
            state.isSignInErrorMsg = action.payload;
            toast.error(action.payload);
        },

        // admin created menus
        addingAppMenuStart: (state, action) => {
            state.isAppMenusFetching = true;
            state.isAppMenusErrorMsg = "";
            state.isAppMenusRemovingSuccess = false
            state.isAppAddingMenusSuccess = false;
        },
        addingAppMenuSuccess: (state, action) => {
            state.isAppMenusFetching = false;
            let newArr = []
            newArr = state.appMenus
            let gotData = action.payload;
            if(gotData.Menu.products.length < 1){
                toast.error("This Menu is Currently Empty")
            }else{
                // adding 1 qty in each of product in menu
                const clonedObj = JSON.parse(JSON.stringify(action.payload))
                let newObj = {}
                for(let i = 0; i !== clonedObj.Menu.products.length; i++){
                    if(i === 0){
                        newObj.products = [];
                        newObj.products.push(clonedObj.Menu.products[i]);
                        newObj.products[i].qty = 1
                        newObj.products[i].subTotal  = newObj.products[i].qty * clonedObj.Menu.products[i].price
                        newObj.products[i].image = clonedObj.Menu.products[i].thumbnail
                    }else{
                        newObj.products.push(clonedObj.Menu.products[i]);
                        newObj.products[i].qty = 1
                        newObj.products[i].subTotal  = newObj.products[i].qty * clonedObj.Menu.products[i].price
                        newObj.products[i].image = clonedObj.Menu.products[i].thumbnail
                    }                    
                }
                
                // checking if new menu is from same restaurant or not
                if(newArr?.length > 0){
                    if(newArr[0]?.restaurant !== clonedObj.Menu.restaurant._id){
                        toast.warning("You can add same restaurant menus to cart.");
                        return;
                    }
                }
                
                newObj.total = clonedObj.total;
                newObj.actualTotal = clonedObj.total;
                newObj.refNo = Math.floor((Math.random()*1000000)+1)
                newObj.Delivery = 2;
                newObj.qty = 1;
                newObj.Menu = clonedObj.Menu._id
                newObj.isCustomMenu = false
                newObj.MenuName = clonedObj.Menu.name
                newObj.Gst = ((16 / 100) * clonedObj.total);
                newObj.actualGst = ((16 / 100) * clonedObj.total);
                newObj.restaurant = clonedObj.Menu.restaurant._id;
                newArr.push(newObj);
                
                // adding to app menu array
                state.appMenus = newArr
                state.isAppAddingMenusSuccess = true;
                toast.success("Menu Added to Cart")
            }

        },
        addingAppMenuSuccessForMenuDetails: (state, action) => {
            state.isAppMenusFetching = false;
            let newArr = []
            newArr = state.appMenus
            let gotData = action.payload;
            if(gotData.products.length < 1){
                toast.error("This Menu is Currently Empty")
            }else{
                // adding 1 qty in each of product in menu
                const clonedObj = JSON.parse(JSON.stringify(action.payload))
                console.log("got data : ", clonedObj)
                let newObj = {}
                for(let i = 0; i !== clonedObj.products.length; i++){
                    if(i === 0){
                        newObj.products = [];
                        newObj.products.push(clonedObj.products[i]);
                        newObj.products[i].qty = 1
                        newObj.products[i].subTotal  = newObj.products[i].qty * clonedObj.products[i].price
                        newObj.products[i].image = clonedObj.products[i].thumbnail
                    }else{
                        newObj.products.push(clonedObj.products[i]);
                        newObj.products[i].qty = 1
                        newObj.products[i].subTotal  = newObj.products[i].qty * clonedObj.products[i].price
                        newObj.products[i].image = clonedObj.products[i].thumbnail
                    }                    
                }
                console.log("===> : ", clonedObj)
                newObj.total = clonedObj.total;
                newObj.actualTotal = clonedObj.total;
                newObj.refNo = Math.floor((Math.random()*1000000)+1)
                newObj.Delivery = 2;
                newObj.qty = 1;
                newObj.Menu = clonedObj._id
                newObj.isCustomMenu = false
                newObj.MenuName = clonedObj.name
                newObj.Gst = ((16 / 100) * clonedObj.total);
                newObj.actualGst = ((16 / 100) * clonedObj.total);
                newObj.restaurant = clonedObj.restaurant._id;
                newArr.push(newObj);
                
                // adding to app menu array
                state.appMenus = newArr
                state.isAppAddingMenusSuccess = true;
                toast.success("Menu Added to Cart")
            }

        },
        addingNewAppMenuSuccess: (state, action) => {
            state.isAppMenusFetching = false;
            let newArr = []
            newArr = state.appMenus
            let menuToBeUpdated = newArr.find(item => item.refNo == action.payload.refNo)
            menuToBeUpdated.total += action.payload.actualTotal;
            menuToBeUpdated.Gst += action.payload.actualGst;
            menuToBeUpdated.qty += 1;
            newArr.filter(item => item.refNo == action.payload.refNo ? menuToBeUpdated : item)
            state.appMenus = newArr
            state.isAppAddingMenusSuccess = true;
        },
        increaseQuantityInAppMenu: (state, action) => {
            state.isCustomMenuFetching = false;
            let myNewArr = []
            myNewArr = state.appMenus
            let menuToBeUpdated = myNewArr.find(item => item.refNo == action.payload.menuId)
            let prodToBeUpdated = menuToBeUpdated.products.find(item => item._id == action.payload.prodId)
            let mySubTotal = prodToBeUpdated.subTotal
            menuToBeUpdated.total -= mySubTotal
            prodToBeUpdated.qty += 1;
            let newSubTotal = prodToBeUpdated.qty * prodToBeUpdated.price
            prodToBeUpdated.subTotal = newSubTotal
            menuToBeUpdated.total += prodToBeUpdated.subTotal
            menuToBeUpdated.total -= menuToBeUpdated.Gst
            let myGst = Number(((16 / 100) * menuToBeUpdated.total));
            menuToBeUpdated.Gst = myGst
            menuToBeUpdated.total += menuToBeUpdated.Gst
            menuToBeUpdated.products.filter(item => item._id == action.payload.prodId ? prodToBeUpdated : item)
            myNewArr.filter(item => item.refNo == action.payload.menuId ? menuToBeUpdated : item)
            state.appMenus = myNewArr
        },
        increaseMenuQuantityInAppMenu: (state, action) => {
            state.isCustomMenuFetching = false;
            let myNewArr = []
            myNewArr = state.appMenus
            let menuToBeUpdated = myNewArr.find(item => item.refNo == action.payload.refNo)
            menuToBeUpdated.total += action.payload.total
            menuToBeUpdated.qty += 1
            menuToBeUpdated.Gst += Number(action.payload.Gst);
            myNewArr.filter(item => item.refNo == action.payload.refNo ? menuToBeUpdated : item)
            state.appMenus = myNewArr
        },
        decreaseMenuQuantityInAppMenu: (state, action) => {
            state.isCustomMenuFetching = false;
            let myNewArr = []
            myNewArr = state.appMenus
            let menuToBeUpdated = myNewArr.find(item => item.refNo == action.payload.refNo)
            menuToBeUpdated.total -= action.payload.actualTotal
            menuToBeUpdated.qty -= 1
            let myGst = Number(((16 / 100) * action.payload.actualTotal));
            menuToBeUpdated.Gst -= action.payload.actualGst;
            myNewArr.filter(item => item.refNo == action.payload.refNo ? menuToBeUpdated : item)
            state.appMenus = myNewArr
        },
        decreaseNewMenuQuantityInAppMenu: (state, action) => {
            state.isAppMenusFetching = true;
            let myNewArr = state.appMenus
            let newArr = myNewArr.filter(item => item.Menu._id != action.payload.Menu._id)
            state.appMenus = newArr
            state.isAppMenusFetching = false;
        },
        decreaseQuantityInAppMenu: (state, action) => {
            state.isCustomMenuFetching = false;
            let myNewArr = []
            myNewArr = state.appMenus
            let menuToBeUpdated = myNewArr.find(item => item.refNo == action.payload.menuId)
            let prodToBeUpdated = menuToBeUpdated.products.find(item => item._id == action.payload.prodId)
            let mySubTotal = prodToBeUpdated.subTotal
            if(menuToBeUpdated.total > 0){
                menuToBeUpdated.total -= mySubTotal
            }
            prodToBeUpdated.qty -= 1;
            let newSubTotal = prodToBeUpdated.qty * prodToBeUpdated.price
            prodToBeUpdated.subTotal = newSubTotal
            menuToBeUpdated.total += prodToBeUpdated.subTotal
            if(menuToBeUpdated.total > 0){
                menuToBeUpdated.total -= menuToBeUpdated.Gst
            }
            let myGst = Number(((16 / 100) * menuToBeUpdated.total));
            menuToBeUpdated.Gst = myGst
            menuToBeUpdated.total += menuToBeUpdated.Gst
            menuToBeUpdated.products.filter(item => item._id == action.payload.prodId ? prodToBeUpdated : item)
            myNewArr.filter(item => item.refNo == action.payload.menuId ? menuToBeUpdated : item)
            state.appMenus = myNewArr
        },
        removingFromAppMenuSuccess: (state, action) => {
            state.isAppMenusFetching = false;
            state.isAppMenusRemovingSuccess = true
            let myNewArr = state.appMenus
            let newArr = myNewArr.filter(item => item.Menu != action.payload)
            toast.success("Menu Removed Successfully!")
            state.appMenus = newArr
        },
        removingAppMenuFailure: (state, action) => {
            state.isAppMenusFetching = false;
            state.isAppAddingMenusSuccess = false;
            state.isAppMenusErrorMsg = action.payload;
        },
        addingAppMenuFailure: (state, action) => {
            state.isAppMenusFetching = false;
            state.isAppMenusSuccess = false;
            state.isAppMenusErrorMsg = action.payload;
            toast.error(action.payload);
        },
        removingAnyMenuFromAppMenus: (state, action) => {
            state.isAppMenusFetching = false;
            let newArr = state.appMenus;
            let finalArr = newArr.filter(item => item.Menu != action.payload)
            if(finalArr.length < 1){
                toast.success("No App Menus left in Cart");
            }
            state.appMenus = finalArr
        },
        emptyingMyAppMenu: (state, action) => {
            state.appMenus = {}
        },

        // user created menu
        addingCustomMenuStart: (state, action) => {
            state.isCustomMenuFetching = true;
            state.isCustomMenuErrorMsg = "";
            state.isCustomMenuAddingSuccess = false;
            state.differentRestaurant = false
        },
        addingCustomMenuSuccess: (state, action) => {
            state.isCustomMenuFetching = false;
            let newArr = []
            if(Object.keys(state.customMenu).length !== 0 ){
                newArr = state.customMenu
                if((state.customMenu.restaurant == action.payload.restaurant._id)){
                    state.differentRestaurant = false
                    const newObj = JSON.parse(JSON.stringify(action.payload))
                    newObj.qty = 1
                    newArr.products.push(newObj)
                    if(newObj.qty){
                        console.log("quantity found of if")
                    }else{
                        console.log("quantity not provided of if")
                        newObj.qty = 1
                    }
                    newObj.subTotal = newObj.qty * newObj.price
                    newArr.total += newObj.subTotal 
                    newArr.total -= newArr.Gst
                    let myGst = Number(((16 / 100) * newArr.total));
                    Number(myGst)
                    newArr.Gst = myGst
                    newArr.total += newArr.Gst
                    newArr.isCustomMenu = true;

                }else{
                    console.log("inside of else")
                    //toast.warning("You can add Items from same Restaurants Only.")
                    state.differentRestaurant = true
                    state.isCustomMenuAddingSuccess = false
                    state.isCustomMenuErrorMsg = "You can Order from only one Restaurant at a Time"
                }
            }else{
                let prodsArr = [] , myTotal = 0
                let newObj = action.payload
                Object.freeze(newObj);
                const objCopy = {...newObj};
                if(objCopy.qty){
                    console.log("quantity found ")
                }else{
                    console.log("quantity not provided")
                    objCopy.qty = 1
                }
                objCopy.subTotal = objCopy.qty * objCopy.price

                prodsArr.push(objCopy)
                let myGst = Number(((16 / 100) * 1));
                Number(myGst)
                let myDelivery = 2;
                myTotal = (Number(objCopy.subTotal)) + Number(myGst) + Number(myDelivery)
                newArr = {
                    products : prodsArr,
                    total : myTotal,
                    Gst : myGst,
                    Delivery : myDelivery,
                    isCustomMenu : true,
                    restaurant : action.payload.restaurant._id
                }
            }
            state.customMenu = newArr
            state.isCustomMenuAddingSuccess = true;
        },
        removingFromCustomMenuSuccess: (state, action) => {
            state.isCustomMenuFetching = false;
            let myNewArr = {}
            myNewArr = state.customMenu
            let prodToBeDeleted = myNewArr.products.find(item => item._id == action.payload._id)
            let newArr = myNewArr.products.filter(item => item._id != action.payload._id)
            myNewArr.products = newArr
            myNewArr.total -= prodToBeDeleted.subTotal
            myNewArr.total -= myNewArr.Gst
            let myGst = Number(((16 / 100) * myNewArr.total));
            myNewArr.Gst = myGst
            myNewArr.total += myNewArr.Gst
            if(myNewArr.products.length === 0){
                myNewArr = {}
            }
            // let newProdsArray = myNewArr.products.filter(item => item._id != action.payload._id)
            console.log("newProdsArray => : ",myNewArr.products )
            //myNewArr.products = newProdsArray
            //state.customMenu = myNewArr
        },
        increaseQuantityInCustomMenu: (state, action) => {
            state.isCustomMenuFetching = false;
            let myNewArr = {}
            myNewArr = state.customMenu
            let prodToBeUpdated = myNewArr.products.find(item => item._id == action.payload)
            let mySubTotal = prodToBeUpdated.subTotal
            myNewArr.total -= mySubTotal
            prodToBeUpdated.qty += 1;
            let newSubTotal = prodToBeUpdated.qty * prodToBeUpdated.price
            prodToBeUpdated.subTotal = newSubTotal
            myNewArr.total += prodToBeUpdated.subTotal
            myNewArr.total -= myNewArr.Gst
            let myGst = Number(((16 / 100) * myNewArr.total));
            myNewArr.Gst = myGst
            myNewArr.total += myNewArr.Gst
            state.customMenu = myNewArr
        },
        decreaseQuantityInCustomMenu: (state, action) => {
            state.isCustomMenuFetching = false;
            let myNewArr = {}
            myNewArr = state.customMenu
            let prodToBeUpdated = myNewArr.products.find(item => item._id == action.payload)
            let mySubTotal = prodToBeUpdated.subTotal
            myNewArr.total -= mySubTotal
            prodToBeUpdated.qty -= 1
            let subTotal = prodToBeUpdated.qty * prodToBeUpdated.price
            prodToBeUpdated.subTotal = subTotal
            myNewArr.total += prodToBeUpdated.subTotal
            myNewArr.total -= myNewArr.Gst
            const myTTotal = myNewArr.total
            let myGst = Number(((16 / 100) * myTTotal));
            myNewArr.Gst = 0
            myNewArr.Gst = myGst
            myNewArr.total += myNewArr.Gst
            state.customMenu = myNewArr
        },
        removingCustomMenuFailure: (state, action) => {
            state.isCustomMenuFetching = false;
            state.isCustomMenuAddingSuccess = false;
            state.isCustomMenuErrorMsg = action.payload;
        },
        addingCustomMenuFailure: (state, action) => {
            state.isCustomMenuFetching = false;
            state.isCustomMenuAddingSuccess = false;
            state.isCustomMenuErrorMsg = action.payload;
        },
        emptyingCustomMenu: (state, action) => {
            state.isCustomMenuFetching = false;
            state.customMenu = {}
            toast.success("Custom Cart Emptied SuccessFully");
            state.differentRestaurant = false
        },
        hideModalForDiffRestaurant: (state, action) => {
            state.differentRestaurant = false
        },

        // orders
        gettingAllOrdersStart: (state, action) => {
            state.isOrdersFetching = true;
            state.isOrdersErrorMsg = "";
            state.isOrdersGettingSuccess= false
            state.orders = [];
        },
        gettingAllOrdersSuccess: (state, action) => {
           state.isOrdersFetching = false
           state.orders = action.payload;
           state.isOrdersGettingSuccess = true
        },
        addComplaintOnAnyOrder: (state, action) => {
            let newArr = state.orders;
            let isFound = newArr.find(item => item._id == action.payload._id )
            if(isFound){
                isFound.isComplaintAdded = true;
                isFound.complaintId = action.payload.complaintId;
                newArr.filter(item => item._id == action.payload ? isFound : item)
            }
            state.orders = newArr
            toast.success("Complaint Added SuccessFully")
        },
        addRatingOnAnyOrder: (state, action) => {
            let newArr = state.orders;
            let newObj = action.payload;
            let isFound = newArr.find(item => item._id == action.payload.orderId )
            if(isFound){
                isFound.isReviewAdded = true;
                isFound.reviewId = action.payload.ReviewId;
                isFound.rating = action.payload.Rating;
                newArr.filter(item => item._id == action.payload ? isFound : item)
            }
            state.orders = newArr
            toast.success("Rating Added SuccessFully")
        },
        cancellingAnyOrder: (state, action) => {
            let newArr = state.orders;
            let isFound = newArr.find(item => item._id == action.payload )
            if(isFound){
                isFound.isCancelledByCustomer = true;
                isFound.orderStatus = "Cancelled By Customer";
                newArr.filter(item => item._id == action.payload ? isFound : item)
            }
            state.orders = newArr
            toast.success("Order Cancelled Added SuccessFully")
        },
        acceptOrDeclineAnyOrder: (state, action) => {
            //let newArr = state.orders;
            const clonedObj = JSON.parse(JSON.stringify(state.orders))
            let newArr = clonedObj.map(item => item);
            let isFound = newArr.find(item => item._id == action.payload.orderId);
            if(isFound){
                if(action.payload.status === "Accepted"){
                    isFound.isPending = false;
                    isFound.isAccepted = true
                }else{
                    isFound.isPending = true;
                    isFound.isAccepted = false
                }
                isFound.isCancelledByCustomer = false;
                isFound.isDelivered = false;
                isFound.orderStatus = action.payload.status;
                newArr.filter(item => item._id == action.payload.orderId ? isFound : item)
            }
            state.orders = newArr
            //toast.success("Order Cancelled Added SuccessFully")
        },
        makeNewReorder: (state, action) => {
            let newArr = state.orders;
            newArr.unshift(action.payload)
            state.orders = newArr
            toast.success("Re Ordered SuccessFully")
        },
        gettingAllOrdersEmpty: (state, action) => {
            state.isOrdersFetching = false
            state.orders = [];
            state.isOrdersGettingSuccess = true
        },
        // getting more order on scroll down
        addMoreOrdersSuccess: (state, action) => {
            state.orders.push(...action.payload);
        },
        gettingMoreOrdersFailure: (state, action) => {
            state.isOrdersFetching = true;
            state.isOrdersErrorMsg = action.payload;
            state.isOrdersGettingSuccess = false
            toast.error(action.payload);
        },

        

        // profile updating
        profileGettingStart: (state, action) => {
            state.isProfileFetching = true;
            state.isProfileErrorMsg = "";
        },
        profileGettingSuccess: (state, action) => {
            state.isProfileFetching = false;
            state.userDetails = action.payload
            toast.success("Profile Updated SuccessFully");
        },
        profileGettingFailure: (state, action) => {
            state.isProfileFetching = false;
            state.isProfileErrorMsg = action.payload;
            toast.error(action.payload);
        },

        // logout
        logOutStart: (state, action) => {
            state.isSignOutFetching = true;
            state.isSignOutError = false;
            state.isSignOutErrorMsg = "";
            state.userSignInSuccess = false;
            state.userSignOutSuccess = false;
        },
        logOutSuccess: (state, action) => {
            state.isSignOutFetching = false;
            state.userSignOutSuccess = true;
            state.userSignInSuccess = false
            state.userDetails = {};
            state.customMenu = [];
            state.appMenus = [];
            toast.success("Signed Out SuccessFully");
        },
        logOutFailure: (state, action) => {
            state.isSignOutFetching = false;
            state.userSignOutSuccess = false;
            state.isSignOutError = true
            state.isSignOutErrorMsg = action.payload;
        },
        
    }
});


export const { 
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
    emptyingMyAppMenu,
    addingAppMenuSuccessForMenuDetails
 } = userReducer.actions;
export default userReducer.reducer;