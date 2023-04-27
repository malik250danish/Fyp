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


// Partner Articles Routes
const getAllArticles = () => API.get(`/api/v1/blogs/getAllBlogsForWeb`);
const getAllArticlesHomeScreen = () => API.get(`/api/v1/blogs/getAllBlogsForPartnerHomeForWeb`);
const getSingleArticleDetails = (blogId) => API.get(`/api/v1/blogs/getSingleBlogForWeb/${blogId}`);
const getAllOrdersOfAnyPartner = () => API.get(`/api/v1/orders/getAllOrdersOfAnyPartnerForWeb`);
const getSingleOrdersOfAnyPartner = (orderId) => API.get(`/api/v1/orders/getAnyOrdersOfAnyPartnerForWeb/${orderId}`);
const updateSingleOrderStatusOfAnyPartner = (orderId, status) => API.put(`/api/v1/orders/changeStatusOfAnyOrderOfAnyPartnerForWeb/${orderId}/${status}`);
const getAllRecentOrdersOfAnyPartner = () => API.get(`/api/v1/orders/getAllOrdersOfAnyPartnerForWebPending`);
const updateSingleOrderStatus = (orderId, status) => API.put(`/api/v1/orders/updateStatusOfAnyOrder/${orderId}/${status}`);
const getSingleReviewDetails = (orderId) => API.get(`/api/v1/reviews/getReviewOnAnyOrder/${orderId}`);
const updateSingleReviewStatus = (reviewId) => API.put(`/api/v1/reviews/updateAnyReviewStatusByOwnerForWeb/${reviewId}`);
const getAllMenusOfPartner = () => API.get(`/api/v1/menus/getAllMenusOfAnyOwner`);
const getAllProductsDropDown = () => API.get(`/api/v1/products/getAllProductsOfAnyOwnerDropdown`);
const getAllRestaurantsDropDown = () => API.get(`/api/v1/restaurants/getAllRestaurantsOfAnyPartnerDropdown`);
const addNewMenu = (data) => API.post(`/api/v1/menus/addNewByOwner`, data);
const addNewRestaurant = (data) => API.post(`/api/v1/restaurants/addNew`, data);
const getANyMenuDetails = (menuId) => API.get(`/api/v1/menus/getAnyMenusDetailsForCommon/${menuId}`);
const updateSingleMenu = (menuId, data) => API.put(`/api/v1/menus/updateAnyMenu/${menuId}`, data);
const updateSingleMenuStatus = (menuId) => API.put(`/api/v1/menus/updateStatusOfAnyMenuByOwner/${menuId}`,);
const getAllProductsOfOwner = () => API.get(`/api/v1/products/getAllProductsOfAnyOwnerNew`);
const getAllMenusForDropdown = () => API.get(`/api/v1/menus/getAllMenusForDropDown`);
const getAllCategoriesForDropdown = () => API.get(`/api/v1/categories/getAllCategoriesForDropDown`);
const getAllSubCategoriesForDropdown = () => API.get(`/api/v1/categories/getAllSubCategoriesForDropDown`);
const addNewProduct = (data) => API.post(`/api/v1/products/addNewByOwner`, data);
const getSingleProductDetails = (productId) => API.get(`/api/v1/products/getAnyProductDetailsForCommon/${productId}`);
const updateSingleProduct = (data, productId) => API.put(`/api/v1/products/updateAnyProduct/${productId}`, data);
const updateSingleProductStatus = (productId) => API.put(`/api/v1/products/changeStatusOfAnyProduct/${productId}`,);
const getAllCoupons = () => API.get(`/api/v1/coupons/getAllCouponsOfAnyPartner`);
const addNewCoupon = (data) => API.post(`/api/v1/coupons/addNewByPartner`, data);
const updateSingleCouponStatus = (couponId) => API.put(`/api/v1/coupons/updateStatusOfAnyCouponByPartner/${couponId}`,);
const getSingleCouponDetails = (couponId) => API.get(`/api/v1/coupons/getDetailsOfAnyCouponForPartner/${couponId}`);
const updateSingleCoupon = (couponId, data) => API.put(`/api/v1/coupons/updateDetailsOfAnyCouponByPartner/${couponId}`, data);
const getAllRestaurants = () => API.get(`/api/v1/restaurants/getAllRestaurantsOfAnyPartner`);
const getSingleRestaurantDetails = (restaurantId) => API.get(`/api/v1/restaurants/getAnyRestaurantDetailsForCommon/${restaurantId}`);
const updateSingleRestaurantStatus = (restaurantId) => API.put(`/api/v1/restaurants/changeStatusOfAnyRestaurant/${restaurantId}`);
const getAnyOrderMyDetails = (orderId) => API.get(`/api/v1/orders/getAnyOrderDetails/${orderId}`);
const updateAnyRestaurant = (restaurantId, data) => API.put(`/api/v1/restaurants/updateAnyRestaurant/${restaurantId}`, data);
const getAllConversationsOfAPartner = () => API.get(`/api/v1/conversations/getAllConversationsOfPartnerForWeb`);
const getMsgsBetPartnerAndAnyCus = (userId) => API.get(`/api/v1/messages/getAllMessagesBetweenTwoUsersByPartnerForWeb/${userId}`);
const sendMsgByPartner = (data) => API.post(`/api/v1/messages/sendNewByPartnerForWeb`, data);
const markAllUnReadMessagesAsReadPartner = (userId) => API.put(`/api/v1/messages/markAllUnReadMessagesAsReadPartner/${userId}`);
const postACommentOnTicketByPartner = (data) => API.post(`/api/v1/ticketComments/postNewIssueCommentForPartner`, data);
const getAllNotifications = () => API.get(`/api/v1/notifications/getAllNotificationsForPartnerForWeb`);
const markAllNotificationsAsSeen = () => API.put(`/api/v1/notifications/markAllUnSeenNotificationAsSeenOfAnyPartner`);
const markAnyNotificationsAsRead = (notificationId) => API.put(`/api/v1/notifications/markReadAnyNotificationForPartner/${notificationId}`);
const getAllComplaints = () => API.get(`/api/v1/complaints/getAllComplaintsOfAnyOwnerForWeb`);
const getDashboardData = () => API.get(`/api/v1/owners/getHomeScreenAppDataForWeb`);
const updatePartnerProfile = (data) => API.put(`/api/v1/owners/updateProfileForWeb`, data);
const getPartnerGraphData = () => API.get(`/api/v1/orders/getGraphDataForWeb`);
const comparePassword = (password) => API.put(`/api/v1/owners/comparePasswords/${password}`);
const updatePassword = (data) => API.put(`/api/v1/owners/updatePasswordOfOwnerForWeb`, data);
const getAllReviews = () => API.get(`/api/v1/reviews/getAllReviewsOfAnyOwnerForWeb`);
const getAllProductsOfRestaurant = (restaurantId) => API.get(`/api/v1/products/getAllProductsOfAnyOwnerForAdmin/${restaurantId}`);
const addNewForumCommentByPartner = (data) => API.post(`/api/v1/forumComments/postNewForumCommentByPartnerForWeb`, data);



export {
    getAllArticles,
    getSingleArticleDetails,
    getAllOrdersOfAnyPartner,
    getSingleOrdersOfAnyPartner,
    updateSingleOrderStatusOfAnyPartner,
    getAllRecentOrdersOfAnyPartner,
    updateSingleOrderStatus,
    getSingleReviewDetails,
    updateSingleReviewStatus,
    getAllMenusOfPartner,
    getAllProductsDropDown,
    getAllRestaurantsDropDown,
    addNewMenu,
    getANyMenuDetails,
    updateSingleMenu,
    updateSingleMenuStatus,
    getAllProductsOfOwner,
    getAllMenusForDropdown,
    getAllCategoriesForDropdown,
    getAllSubCategoriesForDropdown,
    addNewProduct,
    getSingleProductDetails,
    updateSingleProduct,
    updateSingleProductStatus,
    getAllCoupons,
    addNewCoupon,
    updateSingleCouponStatus,
    getSingleCouponDetails,
    updateSingleCoupon,
    getAllRestaurants,
    getSingleRestaurantDetails,
    updateSingleRestaurantStatus,
    getAnyOrderMyDetails,
    addNewRestaurant,
    updateAnyRestaurant,
    getAllConversationsOfAPartner,
    markAllUnReadMessagesAsReadPartner,
    sendMsgByPartner,
    getMsgsBetPartnerAndAnyCus,
    postACommentOnTicketByPartner,
    getAllNotifications,
    markAllNotificationsAsSeen,
    markAnyNotificationsAsRead,
    getAllComplaints,
    getDashboardData,
    getAllArticlesHomeScreen,
    updatePartnerProfile,
    getPartnerGraphData,
    comparePassword,
    updatePassword,
    getAllReviews,
    getAllProductsOfRestaurant,
    addNewForumCommentByPartner
}