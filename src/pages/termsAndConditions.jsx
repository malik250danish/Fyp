import React , { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {getMyTermsAndConditions , getMyTermsAndConditionsEmpty} from '../redux/actions/HomePageActions'
import {useSelector, useDispatch} from 'react-redux'
import moment from 'moment'

const FaqPage = ({socket}) => {
    document.title = 'Terms & Conditions'
    const dispatch = useDispatch();

    const { isTermsAndConditionsFetching , isTermsAndConditionsError , termsAndConditionsText , termsAndConditionsUpdatedAt } = useSelector(state => state.homePageReducer)

    // getting data
    useEffect(() => {
        const getData = async () => {
            //if(termsAndConditionsText?.length < 1){
                dispatch(getMyTermsAndConditions(dispatch))
            //}
        }
        getData()
    },[])

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all terms and conditions
        dispatch(getMyTermsAndConditionsEmpty(dispatch))
    };

    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
          window.removeEventListener("beforeunload", alertUser);
        };
    }, []);
    
    console.log("termsAndConditionsText===> ; ",termsAndConditionsText)

  return (
    <>
        <div className='homepage'>
            <Header socket={socket} />

                {
                    isTermsAndConditionsFetching === true ? (
                        <h4>Fetching</h4>
                    ) : (
                        isTermsAndConditionsError === true ? (
                            <h4>Could Not get Terms and Conditions</h4>
                        ) : (
                            <div style={{ maxWidth : "1240px" , margin : "auto", marginTop : "25px"}} >
                                <div className="container" style={{marginTop : '25px', marginBottom : '15px'}} >
                                    <h3>Terms and Conditions</h3> 
                                    <h6>Updated at: {moment(termsAndConditionsUpdatedAt).format("DD-MMM-YYYY")}</h6>
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: termsAndConditionsText }} />
                            </div>
                        )
                    )
                }

            <Footer/>
        </div>
    </>
  )
}

export default FaqPage