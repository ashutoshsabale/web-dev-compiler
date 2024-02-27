import { FC, ReactNode } from "react"

type Props = { children: ReactNode }

const Card: FC<Props> = ({children}) => {
    return (
        <>
            <h1>Header</h1>
            {children}
            <h3>footer</h3>
        </>
    )
}

export default Card