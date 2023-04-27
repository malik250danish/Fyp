import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify';

const ticketsReducer = createSlice({
    name: "issueTickets",
    initialState:{
        isAllTicketsFetching: false,
        isGetAllTicketsErrorMsg : "",
        isGetAllTicketsSuccess: false,
        allTickets : [],
        isSingleTicketsFetching: false,
        isGetSingleTicketsErrorMsg : "",
        isGetSingleTicketsSuccess: false,
        singleTicket : {},
    },
    reducers: {
        getAllTicketStart: (state, action) => {
            state.isAllTicketsFetching = true;
            state.isGetAllTicketsErrorMsg = "";
            state.isGetAllTicketsSuccess = false;
            state.allTickets = []
        },
        getAllTicketSuccess: (state, action) => {
            state.isAllTicketsFetching = false;
            state.isGetAllTicketsSuccess = true;
            state.allTickets = action.payload;
        },
        // getting more tickets on scroll down
        addMoreTicketData: (state, action) => {
            state.allTickets.push(...action.payload);
        },
        getAllTicketFailure: (state, action) => {
            state.isAllTicketsFetching = false;
            state.isSignInError = true;
            state.isGetAllTicketsErrorMsg = action.payload;
            toast.error(action.payload)
        },
        // emptying all tickets
        getTicketsDataEmpty: (state, action) => {
            state.allTickets = [];
        },
        // adding new issue in start of array
        addNewTicketIssue: (state, action) => {
            state.allTickets.unshift(action.payload);
        },
        getAllFilteredTicketSuccess: (state, action) => {
            state.isAllTicketsFetching = false;
            state.isGetAllTicketsSuccess = true;
        },
        // updating status of any one ticket in tickets array
        updateSingleTicketIssueStatus: (state, action) => {
            let tempData = state.allTickets
            let isFound = tempData.find(item => item._id == action.payload)
            if(isFound){
                if(isFound.status == true){
                    isFound.status = false
                }else{
                    isFound.status = true
                }
                let fdata = tempData.filter(item => item._id == action.payload ? isFound : item)
                state.allTickets = fdata
            }
        },
    }
});


export const { 
    getAllTicketStart,
    getAllTicketSuccess,
    getAllTicketFailure,
    addMoreTicketData,
    getTicketsDataEmpty,
    addNewTicketIssue,
    updateSingleTicketIssueStatus
 } = ticketsReducer.actions;
export default ticketsReducer.reducer;