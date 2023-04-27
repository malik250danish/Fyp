import {
    getAllCategories,
    getAllSubCategoriesOfAnyCategory,
    getAllMenusForMainPage,
    getAllSuggestedRestaurants,
    getAllTermsAndConditions,
    getAllMenus,
    getAllAboutUs,
    getAllFeaturedRestaurants
} from '../../api/CommonApi'
import {addRemoveMenuFromUserFav , addRemoveRestaurantFromUserFav} from "../../api/CustomerApi"
import {
    getMainCategoriesStart,
    getMainCategoriesSuccess,
    getMainCategoriesFailure,
    getSubCategoriesStart,
    getSubCategoriesSuccess,
    getSubCategoriesFailure,
    getTopDealsStart,
    getTopDealsSuccess,
    getTopDealsFailure,
    getTopDealsEmpty,
    getMainCategoriesEmpty,
    getSubCategoriesEmpty,
    getFeaturedRestaurantsStart,
    getFeaturedRestaurantsSuccess,
    getFeaturedRestaurantsEmpty,
    getFeaturedRestaurantsFailure,
    getNearRestaurantsStart,
    getNearRestaurantsSuccess,
    getNearRestaurantsEmpty,
    getNearRestaurantsFailure,
    getTermsAndConditionsStart,
    getTermsAndConditionsSuccess,
    getTermsAndConditionsEmpty,
    getTermsAndConditionsFailure,
    getTopMenusStart,
    getTopMenusSuccess,
    getTopMenusEmpty,
    getTopMenusFailure,
    getAboutUsStart,
    getAboutUsSuccess,
    getAboutUsEmpty,
    getAboutUsFailure,
    addMenuToMyFavoriteSuccess,
    removeMenuToMyFavoriteSuccess,
    addRestaurantToMyFavoriteSuccess,
    removeRestaurantToMyFavoriteSuccess
} from '../reducers/HomePageReducer'
import { toast } from 'react-toastify';


// get all main categories
export const getHomeMainCategories = () => async (dispatch) => {
    dispatch(getMainCategoriesStart())
    try{
        const {data} = await getAllCategories();
        if(data?.success === true){
            dispatch(getMainCategoriesSuccess(data?.AllCategories))
        }else{
            dispatch(getMainCategoriesFailure(data?.message))
        }
    }catch (error) {
        dispatch(getMainCategoriesFailure(error))
    }
}

// getting all main categories empty on tab close
export const getHomeMainCategoriesEmpty = () => async (dispatch) => {
    dispatch(getMainCategoriesStart())
    try{
        dispatch(getMainCategoriesEmpty())
    }catch (error) {
        dispatch(getMainCategoriesFailure(error))
    }
}

// getting all sub categories of any main category
export const getHomeSubCategory = (id) => async (dispatch) => {
    dispatch(getSubCategoriesStart())
    try{
        const {data} = await getAllSubCategoriesOfAnyCategory(id);
        if(data?.success === true){
            dispatch(getSubCategoriesSuccess(data?.AllCategories))
        }else{
            dispatch(getSubCategoriesFailure(data?.message))
        }
    }catch (error) {
        dispatch(getSubCategoriesFailure(error))
    }
}

// getting all main categories empty on tab close
export const getHomeSubCategoryEmpty = () => async (dispatch) => {
    dispatch(getSubCategoriesStart())
    try{
        dispatch(getSubCategoriesEmpty())
    }catch (error) {
        dispatch(getSubCategoriesFailure(error))
    }
}

// getting all top five deals/menus
export const getHomeTopFiveDeals = () => async (dispatch) => {
    dispatch(getTopDealsStart())
    try{
        const {data} = await getAllMenus();
        if(data?.success === true){
            dispatch(getTopDealsSuccess(data?.AllMenus))
        }else{
            dispatch(getTopDealsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getTopDealsFailure(error))
    }
}

// getting all top five deals/menus empty on tab close
export const getEmptyTopFiveDeals = () => async (dispatch) => {
    dispatch(getTopDealsStart())
    try{
            dispatch(getTopDealsEmpty())
    }catch (error) {
        dispatch(getTopDealsFailure(error))
    }
}

// getting home featured restaurants
export const getHomeFeaturedRestaurants = () => async (dispatch) => {
    dispatch(getFeaturedRestaurantsStart())
    try{
        const {data} = await getAllFeaturedRestaurants();
        if(data?.success === true){
            dispatch(getFeaturedRestaurantsSuccess(data?.AllFeatured))
        }else{
            dispatch(getFeaturedRestaurantsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getFeaturedRestaurantsFailure(error))
    }
}

// getting home featured restaurants empty
export const getHomeFeaturedRestaurantsEmpty = () => async (dispatch) => {
    dispatch(getFeaturedRestaurantsStart())
    try{
        dispatch(getFeaturedRestaurantsEmpty())
    }catch (error) {
        dispatch(getFeaturedRestaurantsFailure(error))
    }
}

// getting home near restaurants
export const getHomeNearRestaurants = () => async (dispatch) => {
    dispatch(getNearRestaurantsStart())
    try{
        const {data} = await getAllSuggestedRestaurants();
        if(data?.success === true){
            dispatch(getNearRestaurantsSuccess(data?.AllRestaurants))
        }else{
            dispatch(getNearRestaurantsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getNearRestaurantsFailure(error))
    }
}

// getting home near restaurants empty
export const getHomeNearRestaurantsEmpty = () => async (dispatch) => {
    dispatch(getNearRestaurantsStart())
    try{
        dispatch(getNearRestaurantsEmpty())
    }catch (error) {
        dispatch(getNearRestaurantsFailure(error))
    }
}

// getting home near restaurants
export const getMyTermsAndConditions = () => async (dispatch) => {
    dispatch(getTermsAndConditionsStart())
    try{
        const {data} = await getAllTermsAndConditions();
        if(data?.success === true){
            dispatch(getTermsAndConditionsSuccess(data?.TermsAndConditions[0]))
        }else{
            dispatch(getTermsAndConditionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getTermsAndConditionsFailure(error))
    }
}

// getting home near restaurants empty
export const getMyTermsAndConditionsEmpty = () => async (dispatch) => {
    dispatch(getTermsAndConditionsStart())
    try{
        dispatch(getTermsAndConditionsEmpty())
    }catch (error) {
        dispatch(getTermsAndConditionsFailure(error))
    }
}

// getting top menus all
export const getMyAllTopMenusMain = () => async (dispatch) => {
    dispatch(getTopDealsStart())
    try{
        const {data} = await getAllMenusForMainPage();
        if(data?.success === true){
            dispatch(getTopMenusSuccess(data?.AllMenus))
        }else{
            dispatch(getTopDealsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getTopDealsFailure(error))
    }
}

// getting all top menus empty
export const getMyAllTopMenusEmpty = () => async (dispatch) => {
    dispatch(getTopMenusStart())
    try{
        dispatch(getTopMenusEmpty())
    }catch (error) {
        dispatch(getTopMenusFailure(error))
    }
}

// getting about us page data
export const getMyAboutUsPage = () => async (dispatch) => {
    dispatch(getAboutUsStart())
    try{
        const {data} = await getAllAboutUs();
        if(data?.success === true){
            dispatch(getAboutUsSuccess(data?.AboutUs[0]))
        }else{
            dispatch(getAboutUsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getAboutUsFailure(error))
    }
}

// getting about us page empty
export const getMyAboutUsPageEmpty = () => async (dispatch) => {
    dispatch(getAboutUsStart())
    try{
        dispatch(getAboutUsEmpty())
    }catch (error) {
        dispatch(getAboutUsFailure(error))
    }
}

// adding liked user id to menu favorite
export const addUserIdToFavoriteMenu = (menuData) => async (dispatch) => {
    try{
        const {data} = await addRemoveMenuFromUserFav(menuData.menuId);
        if(data?.success === true){
            dispatch(addMenuToMyFavoriteSuccess(menuData))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        console.log("Error while adding menu to favorite : ", error)
        dispatch(getAboutUsFailure(error))
    }
}

// removing liked user id to menu favorite
export const removeUserIdToFavoriteMenu = (menuData) => async (dispatch) => {
    try{
        const {data} = await addRemoveMenuFromUserFav(menuData.menuId);
        if(data?.success === true){
            dispatch(removeMenuToMyFavoriteSuccess(menuData))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        console.log("Error while adding menu to favorite : ", error)
        dispatch(getAboutUsFailure(error))
    }
}

// adding liked user id to restaurant favorite
export const addUserIdToFavoriteRestaurant = (restaurantData) => async (dispatch) => {
    try{
        const {data} = await addRemoveRestaurantFromUserFav(restaurantData.menuId);
        if(data?.success === true){
            dispatch(addRestaurantToMyFavoriteSuccess(restaurantData))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        console.log("Error while adding menu to favorite : ", error)
        dispatch(getAboutUsFailure(error))
    }
}

// removing liked user id to restaurant favorite
export const removeUserIdToFavoriteRestaurant = (restaurantData) => async (dispatch) => {
    try{
        const {data} = await addRemoveRestaurantFromUserFav(restaurantData.menuId);
        if(data?.success === true){
            dispatch(removeRestaurantToMyFavoriteSuccess(restaurantData))
        }else{
            toast.error(data?.message)
        }
    }catch (error) {
        console.log("Error while adding menu to favorite : ", error)
        dispatch(getAboutUsFailure(error))
    }
}