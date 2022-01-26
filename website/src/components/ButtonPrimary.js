import React from "react";

function ButtonPrimary(props) {
    const { text, className, link } = props;
    return (
      <a href={link}>
        <button className={"btn " + className}>
          <div className="text valign-text-middle roboto-normal-white-18px">
            {text}
          </div>
        </button>
      </a>
    );
  }

  export default ButtonPrimary;