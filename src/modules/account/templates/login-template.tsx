"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"
import ForgotPassword from "../components/forgot-password"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
  FORGOTPASSWORD = "forgot-password",
}
type Props = {
  siteKey: string
}
const LoginTemplate = ({ siteKey }: Props) => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <>
      {/*{currentView === "sign-in" ? (*/}
      {/*  <Login setCurrentView={setCurrentView} />*/}
      {/*) : (*/}
      {/*  <Register setCurrentView={setCurrentView} />*/}
      {/*)}*/}
      {currentView === "forgot-password" ? (
        <ForgotPassword setCurrentView={setCurrentView} />
      ) : currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} />
      ) : (
        <Register setCurrentView={setCurrentView} siteKey={siteKey} />
      )}
    </>
  )
}

export default LoginTemplate
