import React from "react";

const LogoCell = ({path, value}) => (
  <div className="row-cell-center-50">
    {value
      ? <img src={path + 'small-' + value} alt="logo"/>
      : <i className="text-muted">no logo</i>
    }
  </div>
)

export { LogoCell }
