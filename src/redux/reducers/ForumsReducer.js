import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const forumsReducer = createSlice({
    name: "forums",
    initialState:{
        isAllForumsFetching: false,
        isGetAllForumsErrorMsg : "",
        isGetAllForumsSuccess: false,
        allForums : [],
        isSingleForumFetching: false,
        isGetSingleForumErrorMsg : "",
        isGetSingleForumSuccess: false,
        singleForum : {},
    },
    reducers: {
        getallForumStart: (state, action) => {
            state.isAllForumsFetching = true;
            state.isGetAllForumsErrorMsg = "";
            state.isGetAllForumsSuccess = false;
            state.allForums = []
        },
        getallForumSuccess: (state, action) => {
            state.isAllForumsFetching = false;
            state.isGetAllForumsSuccess = true;
            state.allForums = action.payload;
        },
        // getting more forums on scroll down
        addMoreForumsData: (state, action) => {
            state.allForums.push(...action.payload);
        },
        // getting more forums on scroll down
        addOneNewForumsData: (state, action) => {
            state.allForums.unshift(action.payload);
        },
        getAllForumsFailure: (state, action) => {
            state.isAllForumsFetching = false;
            state.isSignInError = true;
            state.isGetAllForumsErrorMsg = action.payload;
            toast.error(action.payload)
        },
        updateStatusOfSingleForum: (state, action) => {
            const clonedObj = JSON.parse(JSON.stringify(state.allForums))
            let newArr = clonedObj.map(item => item);
            let isFound = newArr.find(item => item._id == action.payload.forumId);
            if(isFound){
                isFound.status = action.payload.status;    
                newArr.filter(item => item._id == action.payload.forumId ? isFound : item)
                state.allForums = newArr;
            }
        },
        // emptying all tickets
        getForumsDataEmpty: (state, action) => {
            state.allForums = [];
        },
        // updating replies of any one forum in forums array
        updateSingleForumReplies: (state, action) => {
            let tempData = state.allForums
            let isFound = tempData.find(item => item._id == action.payload)
            if(isFound){
                isFound.replies += 1
                let fdata = tempData.filter(item => item._id == action.payload ? isFound : item)
                state.allForums = fdata
            }
        },
    }
});


export const { 
    getallForumStart,
    getallForumSuccess,
    getAllForumsFailure,
    addMoreForumsData,
    getForumsDataEmpty,
    updateSingleForumReplies,
    addOneNewForumsData,
    updateStatusOfSingleForum
 } = forumsReducer.actions;
export default forumsReducer.reducer;