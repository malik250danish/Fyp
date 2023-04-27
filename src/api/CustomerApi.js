import axios from 'axios'

const API = axios.create({
    baseURL: "https://fivechefapp.cyclic.app",
    //baseURL: "https://fivechefapp.cyclic.app",
    //baseURL : process.env.REACT_APP_LOCAL_SERVER,
    //baseURL : process.env.REACT_APP_LIVE_SERVER,
    withCredentials: true,
});


// this is for using local storage in headers, otherwise it will not work
API.interceptors.request.use((req) => {
    req.headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': 'https://fivechefapp.cyclic.app',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
    return req;
});


// User Auth Routes
const signInUser = (data) => API.post(`/api/v1/customers/signInByWeb`, data);
const signInUserWithGoogle = (data) => API.post(`/api/v1/customers/registerWithGoogleAuthForWeb`, data);
const postNewIssueTicket = (data) => API.post(`/api/v1/tickets/postNewIssue`, data);
const postACommentOnTicket = (data) => API.post(`/api/v1/ticketComments/postNewIssueComment`, data);
const updateStatusOfAnyTicketIssue = (ticketId) => API.put(`/api/v1/tickets/updateSingleTicketIssueStatus/${ticketId}`);
const postACommentOnAnyForum = (data) => API.post(`/api/v1/forumComments/postNewForumComment`, data);
const placeNewOrder = (data) => API.post(`/api/v1/orders/placeNewOrderFromWeb`, data);
const getAllOrdersOfCustomer = () => API.get(`/api/v1/orders/getAllOrdersOfAnyCustomerForWeb`);
const updateProfile = (data) => API.put(`/api/v1/customers/updateProfileForWeb`, data);
const postNewComplaint = (data) => API.post(`/api/v1/complaints/addNewComplaintForWeb`, data);
const postNewReview = (data) => API.post(`/api/v1/reviews/addNewReview`, data);
const cancelAnyOrderByCustomer = (orderId) => API.put(`/api/v1/orders/cancelAnyOrderByCustomerForWeb/${orderId}`);
const placeReOrder = (orderId, data) => API.put(`/api/v1/orders/reOrderAnyPreviousOrderForWeb/${orderId}`, data);
const addRemoveMenuFromUserFav = (menuId) => API.put(`/api/v1/menus/addRemoveFromUserFavoriteForWeb/${menuId}`);
const addRemoveRestaurantFromUserFav = (restaurantId) => API.put(`/api/v1/restaurants/addRemoveRestaurantFromUserFavoritesForWeb/${restaurantId}`);
const getAllConversationsOfACustomer = () => API.get(`/api/v1/conversations/getAllConversationsOfCustomerForWeb`);
const getMsgsBetCusAndAnyPartner = (userId) => API.get(`/api/v1/messages/getAllMessagesBetweenTwoUsersByCustomerForWeb/${userId}`);
const sendMsgByCustomer = (data) => API.post(`/api/v1/messages/sendNewByCustomerForWeb`, data);
const markAllUnReadMessagesAsReadCustomer = (userId) => API.put(`/api/v1/messages/markAllUnReadMessagesAsRead/${userId}`);
const getAllTicketsOfACustomer = () => API.get(`/api/v1/tickets/getAllIssueTicketsOfCustomer`);
const getAllNotifications = () => API.get(`/api/v1/notifications/getAllOfAnyCustomerForWeb`);
const markAllNotificationsAsSeen = () => API.put(`/api/v1/notifications/markAllUnSeenNotificationAsSeenOfAnyCustomer`);
const markAnyNotificationsAsRead = (notificationId) => API.put(`/api/v1/notifications/markReadAnyNotificationForCustomer/${notificationId}`);
const getAnyOrderMyDetails = (orderId) => API.get(`/api/v1/orders/getAnyOrderDetails/${orderId}`);
const getAllMyFavouriteRestaurants = () => API.get(`/api/v1/restaurants/getAllUserFavoriteRestaurantsForWeb`);
const getAllMyFavouriteMenus = () => API.get(`/api/v1/menus/getAllfavoriteOfAnyCustomerForWeb`);
const comparePassword = (password) => API.put(`/api/v1/customers/comparePasswordForWeb/${password}`);
const updatePassword = (data) => API.put(`/api/v1/customers/updatePasswordOfACustomerForWeb`, data);



export {
    signInUser,
    postNewIssueTicket,
    postACommentOnTicket,
    updateStatusOfAnyTicketIssue,
    postACommentOnAnyForum,
    placeNewOrder,
    getAllOrdersOfCustomer,
    updateProfile,
    postNewComplaint,
    postNewReview,
    cancelAnyOrderByCustomer,
    placeReOrder,
    addRemoveMenuFromUserFav,
    addRemoveRestaurantFromUserFav,
    signInUserWithGoogle,
    getAllConversationsOfACustomer,
    getMsgsBetCusAndAnyPartner,
    sendMsgByCustomer,
    markAllUnReadMessagesAsReadCustomer,
    getAllTicketsOfACustomer,
    getAllNotifications,
    markAllNotificationsAsSeen,
    markAnyNotificationsAsRead,
    getAnyOrderMyDetails,
    getAllMyFavouriteRestaurants,
    getAllMyFavouriteMenus,
    comparePassword,
    updatePassword
}