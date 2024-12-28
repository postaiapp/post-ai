import { UseFormRegister, Path } from "react-hook-form"

interface TextInputPasswordProps<T extends object> {
    textValue: Path<T>;
    register: UseFormRegister<T>;
}

export type { TextInputPasswordProps }
