import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import store from './app/store.js'
import { Provider } from 'react-redux'
import Account from './pages/Acoount.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Protected from './Components/Protected.jsx'
import Item from './pages/Item.jsx'
import Home from './pages/Home.jsx'
import MyCartPage from './pages/MyCartPage.jsx'
import { Toaster } from './Components/Toast/toaster.jsx'
import Product from './pages/Product.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='account' element={<Account />} />
      <Route path='login' element={<LoginPage />} />
      <Route path='signup' element={<SignupPage />} />
      <Route path='' element={<Home/>} />
      <Route path='item/:itemId' element={
        <Protected shouldBeAuthenticated={true}>
          <Item />
        </Protected>
      } />
      <Route path='myCart' element={
        <Protected shouldBeAuthenticated={true}>
          <MyCartPage />
        </Protected>
      } />
      <Route path='product' element={<Product/>}/>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster/>
    </Provider>
  </React.StrictMode>
)
