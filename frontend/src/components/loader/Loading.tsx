import "./loader.css";

function Loading() {
  return (
    <div className="w-[100vw] h-[calc(100vh-60px)]">
      <div className="flex justify-center items-center loaderRectangle w-full h-full">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    </div>
  );
}

export default Loading;
