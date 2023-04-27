import './App.css';
import './responsive.css'
import { ToastContainer } from 'react-toastify';
import { useState } from "react"
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import Partner from './pages/Partner';
import PartnerLogin from './pages/PartnerLogin';
import AllFeaturedRestaurants from './pages/AllFeaturedRestaurants';
import AllNearestRestaurants from './pages/NearestRestaurants';
import AllSuggestedRestaurants from './pages/SuggestedRestaurants';
import AllDeals from './pages/AllDeals';
import MenuDetails from './pages/MenuDetails';
import ProductDetails from './pages/ProductDetails';
import FaqPage from './pages/FaqPage';
import TermsAndConditions from './pages/termsAndConditions';
import ForumsListing from './pages/ForumsListing';
import SingleForum from './pages/ViewSingleForum';
import AllTickets from './pages/AllTickets';
import SingleTicket from './pages/ViewSingleTicket';
import AllProducts from './pages/AllProducts';
import PartnerSignUp from './pages/PartnerSignUp';
import ArticleDetails from './pages/ArticleDetails';
import AllCustomerOrders from './pages/AllOrders';
import AboutUs from './pages/AboutUsPage';
import CustomerProfile from './pages/CustomerProfile';
import ContactUs from './pages/ContactUsPage';
import CustomerChat from './pages/CustomerChat';
import PartnerChat from './pages/PartnerChat';
import CustomerSignUp from './pages/CustomerSignUp';
import CustomerOrderView from './pages/CustomerOrderView';
import CustomerFavourites from './pages/CustomerFavorities';
import PlaceOrder from './pages/PlaceOrder';

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from 'react';
import { acceptOrDenySpecificOrderFromOwner, LogOutUser } from "./redux/actions/UserActions"
import { addNewForumToAllForums, testingAction } from "./redux/actions/ForumsActions"
import { toast } from 'react-toastify';

// sockets implementation
import io from 'socket.io-client';
var connectionOptions = {
  "force new connection": true,
  "reconnectionAttempts": "Infinity",
  "timeout": 10000,
  "transports": ["websocket"]
};
export const socket = io.connect('https://fivechefapp.cyclic.app', connectionOptions);


function App() {

  //const [socket, setSocket] = useState(null);
  const { userSignInSuccess, userDetails } = useSelector(state => state.usersReducer)
  const { isPartnerSignInSuccess, partnerDetails } = useSelector(state => state.partnerReducer)
  const dispatch = useDispatch()

  useEffect(() => {
    //setSocket(io.connect('https://fivechefapp.cyclic.app'))
  }, [])

  // sending and receiving socket events
  useEffect(() => {
    // checking if any customer is signed in
    if (userSignInSuccess === true && socket !== null) {
      // event which trigers when user connection becomes connected
      socket.on('connect', function () {
        socket.emit("newCustomerConnected", userDetails)
        console.log("Successfully connected! using connect event");
      });

      // CLIENT CODE
      socket.on('disconnect', function () {
        console.log("disconnect event caught in client side")
      });

      // event for getting order status changed
      socket.on("OrderStatusChangedForCustomer", (customerId, msg, orderId, orderStatus) => {
        if (customerId == userDetails?.Id) {
          toast.success(msg)
          dispatch(acceptOrDenySpecificOrderFromOwner(orderId, orderStatus, dispatch));
        }
      })

      // event for getting order status changed by partner on any accepted order
      socket.on("changeStatusOfAnyOrderByPartner", (customerId, msg, orderId, orderStatus) => {
        if (customerId == userDetails?.Id) {
          toast.success(msg)
          dispatch(acceptOrDenySpecificOrderFromOwner(orderId, orderStatus, dispatch));
        }
      })

      // event for adding newly created forum to all forums
      socket.on("newForumAdded", (newForum) => {
        //toast.success("New Forum Caught" , newForum)
        dispatch(addNewForumToAllForums(newForum, dispatch))
      })

      // event for update any forum status
      socket.on("forumStatusUpdated", (forumId, status) => {
        //toast.success("New Forum Status Added ")
        dispatch(testingAction(forumId, status, dispatch))
      })

      socket.on("accountBlocked", () => {
        toast.warning("Your Account has been temporarily Blocked By 5 Chef's Catering App")
        setTimeout(function () { toast.success("We are Logging You Out for Now") }, 5000)
        dispatch(LogOutUser(dispatch));
      })
    }

    // checking if any new partner is signed in
    if (isPartnerSignInSuccess === true && socket !== null) {
      // event which trigers when user connection becomes connected
      socket.on('connect', function () {
        console.log("============>>>>>>>>>> : ", partnerDetails)
        socket.emit("newCustomerConnected", partnerDetails)
        console.log("Successfully connected! using connect event");
      });

      // CLIENT CODE
      socket.on('disconnect', function () {
        console.log("disconnect event caught in client side")
      });

      // updating last seen of current user's friends
      socket.on("updateFriendStatus", (data) => {
        console.log("updateFriendStatus caught : ", data)
        //dispatch(updateLastSeenOfOthers(data), dispatch);
      })

      // successful connection
      socket.on("connectionSuccessfull", () => {
        console.log("connectionSuccessfull notifications showing")
        //dispatch(ActiveNowUser(currentUser?._id), dispatch);
      })
    }
  }, [isPartnerSignInSuccess, userSignInSuccess, socket])

  return (
    <div className="App" >
      <ToastContainer autoClose={2000} />
      <Router>
        <Routes>
          <Route path='/' element={<Home socket={socket} />} />
          <Route path='/signup' element={userSignInSuccess === true ? (<Home socket={socket} />) : (<CustomerSignUp socket={socket} />)} />
          <Route path='/login' element={userSignInSuccess === true ? (<Home socket={socket} />) : (<Login />)} />
          <Route path='/order-view/:id' element={userSignInSuccess === true ? (<CustomerOrderView socket={socket} />) : (<Login />)} />
          <Route path='/favourities' element={userSignInSuccess === true ? (<CustomerFavourites socket={socket} />) : (<Login />)} />
          <Route path='/customer-chat/:name/:id' element={userSignInSuccess === true ? (<CustomerChat socket={socket} />) : (<Login />)} />
          <Route path='/partner-chat' element={isPartnerSignInSuccess === true ? (<PartnerChat socket={socket} />) : (<PartnerLogin socket={socket} />)} />
          <Route path='/partner-chat/:name/:id' element={isPartnerSignInSuccess === true ? (<PartnerChat socket={socket} />) : (<PartnerLogin socket={socket} />)} />
          <Route path='/customer-chat' element={userSignInSuccess === true ? (<CustomerChat socket={socket} />) : (<Login />)} />
          <Route path='/restaurant/:id' element={<Restaurant socket={socket} />} />
          <Route path='/cart' element={<Cart socket={socket} />} />
          <Route path='/about-us' element={<AboutUs socket={socket} />} />
          <Route path='/contact' element={<ContactUs socket={socket} />} />
          <Route path='/partner/login' element={isPartnerSignInSuccess === true ? (<Partner socket={socket} />) : (<PartnerLogin socket={socket} />)} />
          <Route path='/partner/*' element={isPartnerSignInSuccess === true ? (<Partner socket={socket} />) : (<PartnerLogin socket={socket} />)} />
          <Route path='/partner/signup' element={isPartnerSignInSuccess === true ? (<PartnerLogin />) : (<PartnerSignUp />)} />
          <Route path='/featured-restaurants' element={<AllFeaturedRestaurants socket={socket} />} />
          <Route path='/place-order/:isCustomMenu' element={<PlaceOrder socket={socket} />} />
          <Route path='/nearest-restaurants' element={<AllNearestRestaurants socket={socket} />} />
          <Route path='/suggested-restaurants' element={<AllSuggestedRestaurants socket={socket} />} />
          <Route path='/top-menus' element={<AllDeals socket={socket} />} />
          <Route path='/menu-details/:name/:id' element={<MenuDetails socket={socket} />} />
          <Route path='/product-details/:name/:id' element={<ProductDetails socket={socket} />} />
          <Route path='/faq' element={<FaqPage socket={socket} />} />
          <Route path='/terms-and-conditions' element={<TermsAndConditions socket={socket} />} />
          <Route path='/view-all-forums' element={isPartnerSignInSuccess === true ? (<ForumsListing socket={socket} />) : (<PartnerLogin />)} />
          <Route path='/view-single-forum/:name/:id' element={isPartnerSignInSuccess === true ? (<SingleForum socket={socket} />) : (<PartnerLogin />)} />
          <Route path='/view-all-tickets' element={userSignInSuccess === true || isPartnerSignInSuccess === true ? (<AllTickets socket={socket} />) : (<Login />)} />
          <Route path='/vew-single-ticket/:name/:id' element={userSignInSuccess === true || isPartnerSignInSuccess === true ? (<SingleTicket socket={socket} />) : (userSignInSuccess === true ? <Login /> : <PartnerLogin socket={socket} />)} />
          <Route path='/related-products/:category/:subCategory/:categoryId/:subCategoryId' element={<AllProducts socket={socket} />} />
          <Route path='/article-details/:name/:id' element={isPartnerSignInSuccess === true ? (<ArticleDetails socket={socket} />) : (<PartnerLogin />)} />
          <Route path='/all-orders-of-any-customer' element={userSignInSuccess === true ? (<AllCustomerOrders socket={socket} />) : (<Login />)} />
          <Route path='/customer-profile' element={userSignInSuccess === true ? (<CustomerProfile socket={socket} />) : (<Login />)} />
          {/* <Route path='/all-partner-menus' element={<PartnerMenus />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
