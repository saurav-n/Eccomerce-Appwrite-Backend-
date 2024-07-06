import Footer from "./Components/Footer/Footer"
import Header from "./Components/Header/Header"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router"
import { useEffect } from "react"
import { itemDbService } from "./appwriteServices/database/itemDb"
import { itemActions } from "./app/itemSlice"
import { orderDbService } from "./appwriteServices/database/orderDb"
import { orderActions } from "./app/orderSlice"
import { userDbService } from "./appwriteServices/database/userDb"
import { userActions } from "./app/userSlice"
import { LoadingContextProvider } from "./app/Loadingcontext"
import { authActions } from "./app/authSlice"
import { authService } from "./appwriteServices/authentication"
function App() {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { documents: itemDocuments } = await itemDbService.getAllItems()
        console.log(itemDocuments)
        dispatch(itemActions.loadItems(itemDocuments))
        const { documents: orderDocuments } = await orderDbService.getAllOrders()
        dispatch(orderActions.loadOrders(orderDocuments))
        const { documents: userDocuments } = await userDbService.getAllUser()
        dispatch(userActions.loadUsers(userDocuments))
        console.log('fetched all data');
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          dispatch(authActions.logIn(currentUser))
        }
      } catch (error) {
        console.log(error)
      }
      finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])
  return (
    <LoadingContextProvider value={{ isAppLoading: isLoading }}>
      <Header />
      <Outlet />
      <Footer />
    </LoadingContextProvider>

  )

}

export default App