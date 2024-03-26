import icon from "../assets/icon.png";

function RightColumnHeader() {
  return (
    <div className="h-16 px-2 md:px-4 pt:2 md:pt-4 flex items-center flex-shrink-0">
      <button className="block md:hidden">
        <img
          src={icon}
          alt="logo"
          className="h-6 w-9 flex-shrink-0 flex-grow-0 pl-1 pr-2"
        />
      </button>{" "}
      <nav className="flex flex-1 overflow-x-auto" aria-label="Breadcrumb">
        <ol className="inline-flex items-center">
          <div className="inline-flex items-center">
            <li
              className={[
                "group p-1 select-none flex space-x-1 items-center text-xl font-medium font-poppins text-gray-700 cursor-pointer hover:text-blue-600",
              ].join(" ")}
            >
              <p className="px-1 whitespace-nowrap">Home</p>
            </li>
          </div>
          <p>/</p>
          <div className="inline-flex items-center">
            <li
              className={[
                "group p-1 select-none flex space-x-1 items-center text-xl font-medium font-poppins text-gray-700 cursor-pointer hover:text-blue-600",
              ].join(" ")}
            >
              <p className="px-1 whitespace-nowrap">Your new app</p>
            </li>
          </div>
        </ol>
      </nav>
    </div>
  );
}

export default RightColumnHeader;
