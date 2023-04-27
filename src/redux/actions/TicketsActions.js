import {
    getAllTickets,
} from '../../api/CommonApi'
import {
    getAllTicketStart,
    getAllTicketSuccess,
    getAllTicketFailure,
    addMoreTicketData,
    getTicketsDataEmpty,
    addNewTicketIssue,
    updateSingleTicketIssueStatus
} from '../reducers/TicketsReducer'

// sockets implementation
// import io from 'socket.io-client';
// var connectionOptions =  {
//     "force new connection" : true,
//     "reconnectionAttempts": "Infinity",
//     "timeout" : 10000,
//     "transports" : ["websocket"]
// };
// const socket = io.connect('https://fivechefapp.cyclic.app',connectionOptions);



// getting all tickets
export const getAllTicketsForCustomers = () => async (dispatch) => {
    dispatch(getAllTicketStart())
    try {
        const { data } = await getAllTickets();
        if (data?.success === true) {
            dispatch(getAllTicketSuccess(data?.AllIssueTickets))
        } else {
            dispatch(getAllTicketFailure(data?.message))
        }
    } catch (error) {
        dispatch(getAllTicketFailure("Could Not Sign In, Please try again"))
    }
}

// getting all tickets using filters
export const getAllTicketsWithFilters = (data) => async (dispatch) => {
    dispatch(getAllTicketStart())
    try {
        dispatch(getAllTicketSuccess(data))
    } catch (error) {
        dispatch(getAllTicketFailure("Could Not Sign In, Please try again"))
    }
}

// appending more  tickets data
export const appendMoreTicketsData = (data) => async (dispatch) => {
    try {
        dispatch(addMoreTicketData(data))
    } catch (error) {
        dispatch(getAllTicketFailure("Could Not Sign In, Please try again"))
    }
}

// emptying tickets data
export const emptyTicketsData = (data) => async (dispatch) => {
    try {
        dispatch(getTicketsDataEmpty(data))
    } catch (error) {
        dispatch(getAllTicketFailure("Something went wrong, please try again."))
    }
}

// adding new item tickets array
export const addNewIssueToTicketsData = (data) => async (dispatch) => {
    try {
        dispatch(addNewTicketIssue(data))
    } catch (error) {
        dispatch(getAllTicketFailure("Something went wrong, please try again."))
    }
}

// getting all tickets
export const getAllUnFilteredTickets = () => async (dispatch) => {
    try {
        const { data } = await getAllTickets();
        if (data?.success === true) {
            dispatch(getAllTicketSuccess(data?.AllIssueTickets))
        } else {
            dispatch(getAllTicketFailure(data?.message))
        }
    } catch (error) {
        dispatch(getAllTicketFailure("Could Not Sign In, Please try again"))
    }
}

// update single ticket status
export const updateSingleTicketStatus = (data) => async (dispatch) => {
    try {
        dispatch(updateSingleTicketIssueStatus(data))
    } catch (error) {
        dispatch(getAllTicketFailure("Could Not Sign In, Please try again"))
    }
}
