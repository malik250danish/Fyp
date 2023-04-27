import {
    getAllForums,
} from '../../api/CommonApi'
import {
    getallForumStart,
    getallForumSuccess,
    getAllForumsFailure,
    addMoreForumsData,
    getForumsDataEmpty,
    updateSingleForumReplies,
    addOneNewForumsData,
    updateStatusOfSingleForum
} from '../reducers/ForumsReducer'


// getting all forums
export const getAllForumsForCommon = () => async (dispatch) => {
    dispatch(getallForumStart())
    try{
        const {data} = await getAllForums();
        if(data?.success === true){
            dispatch(getallForumSuccess(data?.AllForums))
        }else{
            dispatch(getAllForumsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getAllForumsFailure("Could Not Sign In, Please try again"))
    }
}

// getting all forums using filters
export const getAllForumsWithFilters = (data) => async (dispatch) => {
    dispatch(getallForumStart())
    try{
        dispatch(getallForumSuccess(data))
    }catch (error) {
        dispatch(getAllForumsFailure("Could Not Sign In, Please try again"))
    }
}

// appending more forums data
export const appendMoreForumsData = (data) => async (dispatch) => {
    try{
        dispatch(addMoreForumsData(data))
    }catch (error) {
        dispatch(getAllForumsFailure("Could Not Sign In, Please try again"))
    }
}

// emptying forums data
export const emptyForumsData = (data) => async (dispatch) => {
    try{
        dispatch(getForumsDataEmpty(data))
    }catch (error) {
        dispatch(getAllForumsFailure("Something went wrong, please try again."))
    }
}

// getting all forums
export const getAllUnFilteredForums = () => async (dispatch) => {
    try{
        const {data} = await getAllForums();
        if(data?.success === true){
            dispatch(getallForumSuccess(data?.AllForums))
        }else{
            dispatch(getAllForumsFailure(data?.message))
        }
    }catch (error) {
        dispatch(getAllForumsFailure("Could Not Sign In, Please try again"))
    }
}

// update single forums replies count
export const updateSingleForumsRepliesCount = (data) => async (dispatch) => {
    try{
        dispatch(updateSingleForumReplies(data))
    }catch (error) {
        dispatch(getAllForumsFailure("Could Not Sign In, Please try again"))
    }
}

// adding newly added forum to all forums
export const addNewForumToAllForums = (forumData) => async (dispatch) => {
    try{
        dispatch(addOneNewForumsData(forumData))
    }catch (error) {
        console.log("Error while adding newly created forum: ", error)
        dispatch(getAllForumsFailure("Could Not Add Newly Added Forum, Please try again"))
    }
}

// updating single forum status
export const testingAction = (id, status) => async (dispatch) => {
    try{
        dispatch(updateStatusOfSingleForum({forumId : id , status : status}))
    }catch (error) {
        console.log("Error while updating single  forum: ", error)
        dispatch(getAllForumsFailure("Could Not update single  forum, Please try again"))
    }
}