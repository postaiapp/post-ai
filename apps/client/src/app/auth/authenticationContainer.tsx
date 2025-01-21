"use client";
import React, { useState } from "react";
import AuthenticationUi from "./authenticationUi"

export default function AuthenticationContainer() {
	const [isRegister, setIsRegister] = useState(false);

	const toggleAuthMode = () => {
		setIsRegister(prevState => !prevState);
	};

	return (
		<AuthenticationUi isRegister={isRegister} toggleAuthMode={toggleAuthMode} />
	);
}
