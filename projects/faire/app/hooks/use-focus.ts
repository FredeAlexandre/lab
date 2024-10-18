import { useEffect, useRef, useState } from "react";

export const useFocus = <T extends HTMLElement>() => {
	const ref = useRef<T>(null);

	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		if (ref.current) {
			const handleFocus = () => setIsFocused(true);
			const handleBlur = () => setIsFocused(false);

			ref.current.addEventListener("focus", handleFocus);
			ref.current.addEventListener("blur", handleBlur);

			return () => {
				ref.current?.removeEventListener("focus", handleFocus);
				ref.current?.removeEventListener("blur", handleBlur);
			};
		}
	}, []);

	const setFocus = () => {
		if (ref.current) {
			ref.current.focus();
		}
	};

	return { ref, setFocus, isFocused };
};
