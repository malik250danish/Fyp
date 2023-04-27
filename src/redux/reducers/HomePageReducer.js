import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const homePageReducer = createSlice({
    name: "Home Page Reducer",
    initialState:{
        isMainCateFetching : false,
        isMainCateError : false,
        allMainCategories : [],
        isSubCateFetching : false,
        isSubCateError : false,
        allSubCategories : [],
        isTopDealsFetching : false,
        isTopDealsError : false,
        allTopDeals : [],
        isFeaturedRestaurantsFetching : false,
        isFeaturedRestaurantsError : false,
        allFeaturedRestaurants : [],
        isNearRestaurantsFetching : false,
        isNearRestaurantsError : false,
        allNearRestaurants : [],
        isSuggestedRestaurantsFetching : false,
        isSuggestedRestaurantsError : false,
        allSuggestedRestaurants : [],
        isTermsAndConditionsFetching : false,
        isTermsAndConditionsError : false,
        termsAndConditionsText : "",
        termsAndConditionsUpdatedAt : "",
        isAllTopMenusFetching : false,
        isAllTopMenusError : false,
        allAllTopMenus : [],
        isAboutUsFetching : false,
        isAboutUsError : false,
        aboutUsText : "",
        aboutUsUpdatedAt : "",
    },
    reducers: {
        // getting main categories
        getMainCategoriesStart: (state, action) => {
            state.isMainCateFetching = true
            state.isMainCateError = false
            state.allMainCategories = []
        },
        getMainCategoriesSuccess: (state, action) => {
            state.isMainCateFetching = false
            state.allMainCategories = action.payload
        },
        getMainCategoriesEmpty: (state, action) => {
            state.allMainCategories = []
        },
        getMainCategoriesFailure: (state, action) => {
            state.isMainCateFetching = false
            state.isMainCateError = true
            toast.error(action.payload)
        },

        // getting sub category
        getSubCategoriesStart: (state, action) => {
            state.isSubCateFetching = true
            state.isSubCateError = false
            state.allSubCategories = []
        },
        getSubCategoriesSuccess: (state, action) => {
            state.isSubCateFetching = false
            state.allSubCategories = action.payload
        },
        getSubCategoriesEmpty: (state, action) => {
            state.allSubCategories = []
        },
        getSubCategoriesFailure: (state, action) => {
            state.isSubCateFetching = false
            state.isSubCateError = true
            toast.error("Could Not Get Sub Categories")
        },
            
        // getting top 5 hottest deals
        getTopDealsStart: (state, action) => {
            state.isTopDealsFetching = true
            state.isTopDealsError = false
            state.allTopDeals = []
        },
        getTopDealsSuccess: (state, action) => {
            state.isTopDealsFetching = false
            state.allTopDeals = action.payload
        },
        getTopDealsEmpty: (state, action) => {
            state.allTopDeals = []
        },
        getTopDealsFailure: (state, action) => {
            state.isTopDealsFetching = false
            state.isTopDealsError = true
            toast.error("Could Not Get Top Deals")
        },

        // getting home page featured restaurants
        getFeaturedRestaurantsStart: (state, action) => {
            state.isFeaturedRestaurantsFetching = true
            state.isFeaturedRestaurantsError = false
            state.allFeaturedRestaurants = []
        },
        getFeaturedRestaurantsSuccess: (state, action) => {
            state.isFeaturedRestaurantsFetching = false
            state.allFeaturedRestaurants = action.payload
        },
        getFeaturedRestaurantsEmpty: (state, action) => {
            state.allFeaturedRestaurants = []
        },
        getFeaturedRestaurantsFailure: (state, action) => {
            state.isFeaturedRestaurantsFetching = false
            state.isFeaturedRestaurantsError = true
            toast.error("Could Not Get All Featured Restaurants")
        },

        // getting home page near restaurants
        getNearRestaurantsStart: (state, action) => {
            state.isNearRestaurantsFetching = true
            state.isNearRestaurantsError = false
            state.allNearRestaurants = []
            state.termsAndConditionsUpdatedAt = ""
        },
        getNearRestaurantsSuccess: (state, action) => {
            state.isNearRestaurantsFetching = false
            state.allNearRestaurants = action.payload
        },
        addRestaurantToMyFavoriteSuccess: (state, action) => {
            // setting near restaurants first
            const clonedObj = JSON.parse(JSON.stringify(state.allNearRestaurants))
            let newTemp = clonedObj.map(item => item);
            let isTopFound = newTemp.find(item => item._id == action.payload.menuId)
            if(isTopFound){
                isTopFound.favoritesUsers.push(action.payload.userId);
                let tempArray = newTemp.filter(item => item._id == action.payload.menuId ? isTopFound : item)
                state.allNearRestaurants = tempArray
            }

            // finding all menus
            // const clonedNewObj = JSON.parse(JSON.stringify(state.allAllTopMenus))
            // let newMyTemp = clonedNewObj.map(item => item);
            // let isAllFound = newMyTemp.find(item => item.Menu._id == action.payload.menuId)
            // if(isAllFound){
            //     isAllFound.Menu.favoritesUsers.push(action.payload.userId);
            //     newMyTemp.filter(item => item.Menu._id == action.payload.menuId ? isAllFound : item)
            //     state.allAllDeals = newMyTemp
            // }
        },
        removeRestaurantToMyFavoriteSuccess: (state, action) => {
            // setting first all top 5 deals first
            const clonedObj = JSON.parse(JSON.stringify(state.allNearRestaurants))
            let newTemp = clonedObj.map(item => item);
            let isTopFound = newTemp.find(item => item._id == action.payload.menuId)
            if(isTopFound){
                let myTempArr = isTopFound.favoritesUsers.filter(item => item !== action.payload.userId);
                isTopFound.favoritesUsers = myTempArr
                let tempArray = newTemp.filter(item => item._id == action.payload.menuId ? isTopFound : item)
                state.allNearRestaurants = tempArray
            }

            // finding all menus
            // const clonedNewObj = JSON.parse(JSON.stringify(state.allAllTopMenus))
            // let newMyTemp = clonedNewObj.map(item => item);
            // let isAllFound = newMyTemp.find(item => item.Menu._id == action.payload.menuId)
            // if(isAllFound){
            //     let myTempArr = isAllFound.Menu.favoritesUsers.filter(item => item !== action.payload.userId);
            //     isAllFound.Menu.favoritesUsers = myTempArr
            //     newMyTemp.filter(item => item.Menu._id == action.payload.menuId ? isAllFound : item)
            //     state.allAllDeals = newMyTemp
            // }
        },
        getNearRestaurantsEmpty: (state, action) => {
            state.allNearRestaurants = []
        },
        getNearRestaurantsFailure: (state, action) => {
            state.isNearRestaurantsFetching = false
            state.isNearRestaurantsError = true
            toast.error("Could Not Near Restaurants")
        },

        // getting terms and conditions
        getTermsAndConditionsStart: (state, action) => {
            state.isTermsAndConditionsFetching = true
            state.isTermsAndConditionsError = false
            state.termsAndConditionsText = ""
            state.termsAndConditionsUpdatedAt = ""
        },
        getTermsAndConditionsSuccess: (state, action) => {
            state.isTermsAndConditionsFetching = false
            state.termsAndConditionsText = action.payload.desc
            state.termsAndConditionsUpdatedAt = action.payload.createdAt
        },
        getTermsAndConditionsEmpty: (state, action) => {
            state.termsAndConditionsText = ""
            state.termsAndConditionsUpdatedAt = ""
        },
        getTermsAndConditionsFailure: (state, action) => {
            state.isTermsAndConditionsFetching = false
            state.isTermsAndConditionsError = true
            toast.error("Could Not get Terms and Conditions")
        },


        // getting top menus all
        getTopMenusStart: (state, action) => {
            state.isAllTopMenusFetching = true
            state.isAllTopMenusError = false
            state.allAllTopMenus = []
        },
        getTopMenusSuccess: (state, action) => {
            state.isAllTopMenusFetching = false
            state.allAllTopMenus = action.payload
        },
        addMenuToMyFavoriteSuccess: (state, action) => {
            // setting first all top 5 deals first
            const clonedObj = JSON.parse(JSON.stringify(state.allTopDeals))
            let newTemp = clonedObj.map(item => item);
            let isTopFound = newTemp.find(item => item.Menu._id == action.payload.menuId)
            if(isTopFound){
                isTopFound.Menu.favoritesUsers.push(action.payload.userId);
                let tempArray = newTemp.filter(item => item.Menu._id == action.payload.menuId ? isTopFound : item)
                state.allTopDeals = tempArray
            }

            // finding all menus
            const clonedNewObj = JSON.parse(JSON.stringify(state.allAllTopMenus))
            let newMyTemp = clonedNewObj.map(item => item);
            let isAllFound = newMyTemp.find(item => item.Menu._id == action.payload.menuId)
            if(isAllFound){
                isAllFound.Menu.favoritesUsers.push(action.payload.userId);
                newMyTemp.filter(item => item.Menu._id == action.payload.menuId ? isAllFound : item)
                state.allAllDeals = newMyTemp
            }
        },
        removeMenuToMyFavoriteSuccess: (state, action) => {
            // setting first all top 5 deals first
            const clonedObj = JSON.parse(JSON.stringify(state.allTopDeals))
            let newTemp = clonedObj.map(item => item);
            let isTopFound = newTemp.find(item => item.Menu._id == action.payload.menuId)
            if(isTopFound){
                let myTempArr = isTopFound.Menu.favoritesUsers.filter(item => item !== action.payload.userId);
                isTopFound.Menu.favoritesUsers = myTempArr
                let tempArray = newTemp.filter(item => item.Menu._id == action.payload.menuId ? isTopFound : item)
                state.allTopDeals = tempArray
            }

            // finding all menus
            const clonedNewObj = JSON.parse(JSON.stringify(state.allAllTopMenus))
            let newMyTemp = clonedNewObj.map(item => item);
            let isAllFound = newMyTemp.find(item => item.Menu._id == action.payload.menuId)
            if(isAllFound){
                let myTempArr = isAllFound.Menu.favoritesUsers.filter(item => item !== action.payload.userId);
                isAllFound.Menu.favoritesUsers = myTempArr
                newMyTemp.filter(item => item.Menu._id == action.payload.menuId ? isAllFound : item)
                state.allAllDeals = newMyTemp
            }
        },
        getTopMenusEmpty: (state, action) => {
            state.allAllTopMenus = []
        },
        getTopMenusFailure: (state, action) => {
            state.isAllTopMenusFetching = false
            state.isAllTopMenusError = true
            toast.error("Could Not Get Top Menus")
        },

        // getting about us details
        getAboutUsStart: (state, action) => {
            state.isAboutUsFetching = true
            state.isAboutUsError = false
            state.aboutUsText = ""
            state.aboutUsUpdatedAt = ""
        },
        getAboutUsSuccess: (state, action) => {
            state.isAboutUsFetching = false
            state.aboutUsText = action.payload.desc
            state.aboutUsUpdatedAt = action.payload.createdAt
        },
        getAboutUsEmpty: (state, action) => {
            state.aboutUsText = ""
            state.aboutUsUpdatedAt = ""
        },
        getAboutUsFailure: (state, action) => {
            state.isAboutUsFetching = false
            state.isAboutUsError = true
            toast.error("Could Not Get About Us Data")
        },
    }
});


export const { 
    getMainCategoriesStart,
    getMainCategoriesSuccess,
    getMainCategoriesFailure,
    getMainCategoriesEmpty,
    getSubCategoriesStart,
    getSubCategoriesSuccess,
    getSubCategoriesFailure,
    getSubCategoriesEmpty,
    getTopDealsStart,
    getTopDealsSuccess,
    getTopDealsFailure,
    getTopDealsEmpty,
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
    removeRestaurantToMyFavoriteSuccess,
 } = homePageReducer.actions;
export default homePageReducer.reducer;