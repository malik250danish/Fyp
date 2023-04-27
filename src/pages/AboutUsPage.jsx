import React , { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {getMyAboutUsPage , getMyAboutUsPageEmpty} from '../redux/actions/HomePageActions'
import {useSelector, useDispatch} from 'react-redux'
import moment from 'moment'

const FaqPage = ({socket}) => {
    document.title = 'Terms & Conditions'
    const dispatch = useDispatch();

    const { isAboutUsFetching , isAboutUsError , aboutUsText , aboutUsUpdatedAt } = useSelector(state => state.homePageReducer)

    // getting data
    useEffect(() => {
        const getData = async () => {
            if(aboutUsText?.length < 1){
                dispatch(getMyAboutUsPage(dispatch))
            }
        }
        getData()
    },[])

    // emptying all arrays fetched on reload.
    const alertUser = (e) => {
        // emptying all terms and conditions
        dispatch(getMyAboutUsPageEmpty(dispatch))
    };

    useEffect(() => {
        window.addEventListener("beforeunload", alertUser);
        return () => {
          window.removeEventListener("beforeunload", alertUser);
        };
    }, []);

  return (
    <>
        <div className='homepage'>
            <Header socket={socket} />

                {
                    isAboutUsFetching === true ? (
                        <h4>Fetching</h4>
                    ) : (
                        isAboutUsError === true ? (
                            <h4>Could Not get About Us Content</h4>
                        ) : (
                            <div style={{ maxWidth : "1240px" , margin : "auto", marginTop : "25px"}} >
                                <div className="container" style={{marginTop : '25px', marginBottom : '15px'}} >
                                    <h3>About Us</h3> 
                                    <h6>Updated at: {moment(aboutUsUpdatedAt).format("DD-MMM-YYYY")}</h6>
                                </div>
                                <div style={{marginTop : "55px"}} dangerouslySetInnerHTML={{ __html: aboutUsText }} />
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