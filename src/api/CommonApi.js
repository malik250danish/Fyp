import axios from 'axios'


const API = axios.create({
    baseURL: "https://fivechefapp.cyclic.app",
    //baseURL: "https://fivechefapp.cyclic.app",
    //baseURL : process.env.REACT_APP_LOCAL_SERVER,
    //baseURL : process.env.REACT_APP_LIVE_SERVER,
    withCredentials: true,
});

// onDownloadProgress(progress) {
//     console.log('download progress:', progress);
// }

// this is for using local storage in headers, otherwise it will not work
API.interceptors.request.use((req) => {
    req.headers = {
        'Accept': 'application/json',
        //'Access-Control-Allow-Origin': 'https://fivechefapp.cyclic.app',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
    return req;
});


// Categories Routes
const getAllCategories = () => API.get(`/api/v1/categories/getAllCategoriesForCommon`);
const getAllSubCategoriesOfAnyCategory = (categoryId) => API.get(`/api/v1/categories/getAllSubCategoriesOfAnyCategoryCommon/${categoryId}`);
const getAllMenus = () => API.get(`/api/v1/menus/getAllMenusForCommon`);
const getAllMenusForMainPage = () => API.get(`/api/v1/menus/getAllMenusForCommonForMainPage`);
const getAllRestaurants = () => API.get(`/api/v1/restaurants/getAllRestaurantsForCommon`);
const getAllFeaturedRestaurants = () => API.get(`/api/v1/restaurants/getAllFeaturedRestaurantsForCommon`);
const getTopProducts = () => API.get(`/api/v1/products/getAllProductsForCustomersWithOutLogin`);
const getAllNearRestaurants = () => API.get(`/api/v1/restaurants/getAllRestaurantsForCommon`);
const getAllSuggestedRestaurants = () => API.get(`/api/v1/restaurants/getAllSuggestedRestaurantsForCommon`);
const getAllSuggestedRestaurantsMainPage = () => API.get(`/api/v1/restaurants/getAllSuggestedRestaurantsForCommonMainPage`);
const getSingleRestaurantDetails = (restaurantId) => API.get(`/api/v1/restaurants/getAnyRestaurantDetailsForCommon/${restaurantId}`);
const getSingleRestaurantDistance = (restaurantId, data) => API.put(`/api/v1/restaurants/getAnyRestaurantDistanceFromUser/${restaurantId}`, data);
const getAllMenusOfAnyRestaurant = (restaurantId) => API.get(`/api/v1/menus/getAllMenusOfAnyRestaurantForCommon/${restaurantId}`);
const getSingleMenuDetails = (menuId) => API.get(`/api/v1/menus/getAnyMenusDetailsForCommonWeb/${menuId}`);
const getSingleProductDetails = (productId) => API.get(`/api/v1/products/getAnyProductDetailsForCommon/${productId}`);
const getAllTermsAndConditions = () => API.get(`/api/v1/terms&Conditions/getAll`);
const getSingleTicketIssue = (ticketId) => API.get(`/api/v1/tickets/getSingleIssue/${ticketId}`);
const getAllCommentsOnAIssueTicket = (ticketId) => API.get(`/api/v1/ticketComments/getAllIssueTicketsComments/${ticketId}`);
const getAllTickets = () => API.get(`/api/v1/tickets/getAllIssueTickets`);
const getAllForums = () => API.get(`/api/v1/forums/getAllForums`);
const getSingleForum = (forumId) => API.get(`/api/v1/forums/getSingleForum/${forumId}`);
const getAllCommentsOnAnyForum = (forumId) => API.get(`/api/v1/forumComments/getAllCommentsOnAnyForum/${forumId}`);
const getAllProductsRelatedToAnyCategory = (categoryId, subCategoryId) => API.get(`/api/v1/products/getProductsRelatedToCategoryAndSubCategory/${categoryId}/${subCategoryId}`);
const signUpPartner = (data) => API.post(`/api/v1/owners/register`, data);
const signInPartner = (data) => API.post(`/api/v1/owners/signInFromWeb`, data);
const getAllAboutUs = () => API.get(`/api/v1/aboutUs/getAll`);
const sendContactEmail = (data) => API.put(`/api/v1/admin/sendContactUsEmail`, data);
const getSingleComplaint = (complaintId) => API.get(`/api/v1/complaints/getComplaintOnAnyOrder/${complaintId}`);
const getAllFAqs = () => API.get(`/api/v1/faqs/getAllFaqs`);
const getAllReviewsOnAnyRestaurant = (restaurantId) => API.get(`/api/v1/reviews/getAllReviewsOnAnyRestaurant/${restaurantId}`);
const signUpCustomer = (data) => API.post(`/api/v1/customers/register`, data);
const getAllProductsOfOwnerCommon = (ownerId) => API.get(`/api/v1/products/getAllProductsOfAnyOwnerCommon/${ownerId}`);
const getDistanceOfRestaurantFromUser = (restaurantId, data) => API.put(`/api/v1/restaurants/getAnyRestaurantDistanceFromUser/${restaurantId}`, data);
const getRestaurantsForSearching = () => API.get(`/api/v1/restaurants/getAllRestaurantsForSearching`);



export {
    getAllCategories,
    getAllSubCategoriesOfAnyCategory,
    getAllMenus,
    getAllRestaurants,
    getTopProducts,
    getAllNearRestaurants,
    getAllSuggestedRestaurants,
    getSingleRestaurantDetails,
    getSingleRestaurantDistance,
    getAllMenusOfAnyRestaurant,
    getAllMenusForMainPage,
    getAllSuggestedRestaurantsMainPage,
    getSingleMenuDetails,
    getSingleProductDetails,
    getAllTermsAndConditions,
    getSingleTicketIssue,
    getAllCommentsOnAIssueTicket,
    getAllTickets,
    getAllForums,
    getSingleForum,
    getAllCommentsOnAnyForum,
    getAllProductsRelatedToAnyCategory,
    signUpPartner,
    signInPartner,
    getAllAboutUs,
    sendContactEmail,
    getSingleComplaint,
    getAllFAqs,
    getAllReviewsOnAnyRestaurant,
    signUpCustomer,
    getAllProductsOfOwnerCommon,
    getDistanceOfRestaurantFromUser,
    getRestaurantsForSearching,
    getAllFeaturedRestaurants
}