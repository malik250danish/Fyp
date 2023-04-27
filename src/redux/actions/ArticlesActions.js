import {
    getAllArticlesHomeScreen,
} from '../../api/PartnerApi'
import {
    getAllArticlesStart,
    getallArticlesSuccess,
    getAllArticlesFailure,
    addMoreArticlesData,
    getArticlesDataEmpty,
} from '../reducers/ArticlesReducer'

// sockets implementation
// import io from 'socket.io-client';
// var connectionOptions =  {
//     "force new connection" : true,
//     "reconnectionAttempts": "Infinity",
//     "timeout" : 10000,
//     "transports" : ["websocket"]
// };
// const socket = io.connect('https://fivechefapp.cyclic.app',connectionOptions);



// getting all training article
export const getAllMyArticles = () => async (dispatch) => {
    dispatch(getAllArticlesStart())
    try {
        const { data } = await getAllArticlesHomeScreen();
        if (data?.success === true) {
            dispatch(getallArticlesSuccess(data))
        } else {
            dispatch(getAllArticlesFailure(data?.message))
        }
    } catch (error) {
        dispatch(getAllArticlesFailure("Could Not Sign In, Please try again"))
    }
}

// appending more forums data
export const appendMoreArticlesData = (data) => async (dispatch) => {
    try {
        dispatch(addMoreArticlesData(data))
    } catch (error) {
        dispatch(getAllArticlesFailure("Could Not add more data, Please try again"))
    }
}

// emptying forums data
export const emptyArticlesData = (data) => async (dispatch) => {
    try {
        dispatch(getArticlesDataEmpty(data))
    } catch (error) {
        dispatch(getAllArticlesFailure("Something went wrong, please try again."))
    }
}

