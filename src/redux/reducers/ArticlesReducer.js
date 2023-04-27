import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const forumsReducer = createSlice({
    name: "Training Articles",
    initialState:{
        isAllArticlesFetching: false,
        isGetAllArticlesErrorMsg : "",
        isGetAllArticlesSuccess: false,
        isShowMoreArticles : true,
        allArticles : [],
    },
    reducers: {
        getAllArticlesStart: (state, action) => {
            state.isAllArticlesFetching = true;
            state.isGetAllArticlesErrorMsg = "";
            state.isGetAllArticlesSuccess = false;
            state.allArticles = []
        },
        getallArticlesSuccess: (state, action) => {
            state.isAllArticlesFetching = false;
            state.isGetAllArticlesSuccess = true;
            state.allArticles = action.payload.AllBlogs;
            state.isShowMoreArticles = action.payload.isShowMore
        },
        // getting more forums on scroll down
        addMoreArticlesData: (state, action) => {
            state.isShowMoreArticles = action.payload.isShowMore
            state.allArticles.push(...action.payload.AllBlogs);
        },
        getAllArticlesFailure: (state, action) => {
            state.isAllArticlesFetching = false;
            state.isSignInError = true;
            state.isGetAllArticlesErrorMsg = action.payload;
            toast.error(action.payload)
        },
        // emptying all tickets
        getArticlesDataEmpty: (state, action) => {
            state.allArticles = [];
        },
    }
});


export const { 
    getAllArticlesStart,
    getallArticlesSuccess,
    getAllArticlesFailure,
    addMoreArticlesData,
    getArticlesDataEmpty,
 } = forumsReducer.actions;
export default forumsReducer.reducer;