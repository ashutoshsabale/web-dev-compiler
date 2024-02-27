import { FC } from "react";

interface IProp {
    name: string;
}

const NotFound: FC<IProp> = ({name}) => {
    return (
        <div className="w-full h-[calc(100dvh-60px)] bg-gray-800 text-white flex justify-center items-center text-2xl font-bold flex-col ">
            <span className="text-9xl mb-5 font-bold">404 {name}</span>
            Page Not found
        </div>
  );
}

export default NotFound;
