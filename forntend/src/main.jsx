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
import Landing from './pages/Landing.jsx'
import MyCartPage from './pages/MyCartPage.jsx'
import { Toaster } from './Components/Toast/toaster.jsx'
import Product from './pages/Product.jsx'
import AddProduct from './pages/AddProduct.jsx'
import UpdateProduct from './pages/UpdateProduct.jsx'
import AdminProductPage from './pages/AdminProductPage.jsx'
import AdminCategoryPage from './pages/AdminCategoryPage.jsx'
import CheckoutPage from './pages/CheckOutPage.jsx'
import PaySuccess from './pages/PaySuccess.jsx'
import AccountPage from './pages/AccountPage.jsx'
import OrderDetailPage from './pages/OrderDetailPage.jsx'
import AdminOrdersPage from './pages/AdminOrdersPage.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path="/account" element={<AccountPage />} />
        <Route path="" element={<Landing />} />
        <Route path="addProduct" element={<AddProduct />} />
        <Route path="item/:itemId" element={<Item />} />
        <Route path="myCart" element={<MyCartPage />} />
        <Route path="product" element={<Product />} />
        <Route path="updateProduct/:id" element={<UpdateProduct />} />
        <Route path="products" element={<AdminProductPage />} />
        <Route path="categories" element={<AdminCategoryPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pay/success" element={<PaySuccess />} />
        <Route path="/order/:orderId/detail" element={<OrderDetailPage />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
)
