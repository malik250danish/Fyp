import React , {useState , useEffect} from 'react'
import { Route, Routes , useNavigate } from 'react-router-dom'
import PartnerAnalytics from './PartnerAnalytics'
import PartnerHome from './PartnerHome'
import PartnerLogin from './PartnerLogin'
import PartnerOrders from './PartnerOrders'
import PartnerOrdersView from './PartnerOrdersView'
import AllOrders from './PartnerAllOrders'
import AllMenus from './PartnerViewAllMenus'
import AllProducts from './PartnerAllProducts'
import AllCoupons from './PartnerAllCoupons'
import AllRestaurants from './PartnerAlLRestaurants'
import PartnerCalender from './PartnerCalender'
import PartnerComplaints from './PartnerAllComplaints'
import AllArticles from './AllArticles'
import PartnerProfile from './PartnerProfile'
import PartnerReviewManagement from './PartnerReviewManagement'

import {useSelector, useDispatch} from 'react-redux'
import { toast } from 'react-toastify';
import {appendOmeRecentOrdersOfPartner ,changeStatusOfAnyCancelledOrder} from '../redux/actions/PartnerActions'
import Cookies from 'universal-cookie';


const Partner = ({socket}) => {
  const cookies = new Cookies();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isPartnerSignInSuccess , partnerOrders , partnerDetails } = useSelector(state => state.partnerReducer)


    // getting all related products
    useEffect(() => {
        const getData = async () => {
          let partnerToken = cookies.get('fiveChefsPartnersTempToken')
            if(isPartnerSignInSuccess === false){
              toast.error("Please Sign In to Continue")
                navigate("/partner/login")
            }else{
                if(partnerOrders?.length < 1){
                  navigate("/partner/orders")
                }
            }
        }

        
        getData() 
    },[isPartnerSignInSuccess])

    // getting events for partners
    useEffect(() => {
      //if(isPartnerSignInSuccess === true){
        console.log("===================  Got inside ====================")
        //toast.warning("Catching ....")
        // event for getting new order
        socket.on('newOrderPlaced', function(ownerId, orderData) {
          //toast.success("Catching ....")
          console.log("======>>>>>>>> : ", ownerId , orderData)
          // checking if sent event is for currently online user or not, if yes, appending new order to partner orders
            if(ownerId == partnerDetails?.Id){
                toast.success("You have Received New Order.")
                dispatch(appendOmeRecentOrdersOfPartner(orderData, dispatch))
            }
        });

         // event for getting order cancellation by customer
         socket.on('cancelAnyOrderByCustomer', function(ownerId , msg , orderId , orderStatus) {
          console.log("got msg : ", ownerId , msg , orderId , orderStatus)
          // checking if sent event is for currently online user or not, if yes, appending new order to partner orders
            if(ownerId == partnerDetails?.Id){
                toast.warning(msg)
                dispatch(changeStatusOfAnyCancelledOrder(orderId , orderStatus , dispatch))
            }
        });
      //}
    },[socket])

  return (
    <div className='partner-page'>
        <Routes>
            <Route path='/' element={<PartnerHome socket={socket}  />} />
            {/* <Route path='/login' element={<PartnerLogin />} /> */}
            <Route path='/orders' element={<PartnerOrders socket={socket}  />} />
            <Route path='/orders/view/:id' element={<PartnerOrdersView  socket={socket} />} />
            <Route path='/analytics' element={<PartnerAnalytics socket={socket}  />} />
            <Route path='/allOrders' element={<AllOrders socket={socket}  />} />
            <Route path='/all-menus' element={<AllMenus socket={socket}  />} />
            <Route path='/all-products' element={<AllProducts socket={socket}  />} />
            <Route path='/all-coupons' element={<AllCoupons socket={socket}  />} />
            <Route path='/all-restaurants' element={<AllRestaurants socket={socket}  />} />
            <Route path='/calender' element={<PartnerCalender socket={socket}  />} />
            <Route path='/complaints' element={<PartnerComplaints socket={socket}  />} />
            <Route path='/articles' element={<AllArticles socket={socket}  />} />
            <Route path='/profile' element={<PartnerProfile socket={socket}  />} />
            <Route path='/review-management' element={<PartnerReviewManagement socket={socket}  />} />
        </Routes>
    </div>
  )
}

export default Partner