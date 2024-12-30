"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import AuthenticationContainer from "./authenticationContainer";

export default function Authentication() {
	return (
		<>
			<ToastContainer />
			<AuthenticationContainer />
		</>
	);
}
