import { useState, forwardRef, type Ref } from "react"

type BaseButtonAttributes = React.ComponentPropsWithoutRef<"button">
interface ButtonProps extends BaseButtonAttributes {
    isLoading?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactElement;
    rightIcon?: React.ReactElement;
    className?: string,
    styles?:string
}

const JoinTeamsConfig = forwardRef<Ref, ButtonProps>((props, ref) => {
    const { type, buttonStyle, disabled, isLoading, leftIcon, rightIcon, className, ...rest } = props;

    return (
        <button
            {...rest}
            type={type ? "submit" : "button"}
            ref={ref}
            disabled={disabled || isLoading}
        >
            <p>unirse a un equipo</p>
        </button>
    )
}
);


export default JoinTeamsConfig; 