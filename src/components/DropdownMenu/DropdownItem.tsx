import React, { useContext } from 'react';

import { DropdownContext } from './DropdownContext';

const DropdownItem: React.FC = ({ children }) => {
  const { close } = useContext(DropdownContext);

  const handleClick = (
    onClickHandler: Function,
  ): React.MouseEventHandler<HTMLDivElement> => (e) => {
    e.stopPropagation();

    if (typeof onClickHandler === 'function') {
      onClickHandler();
    }

    close();
  };

  return (
    <div className="dropdown-items__item">
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            ...children.props,
            onClick: handleClick(children.props.onClick),
          })
        : children}
    </div>
  );
};

export { DropdownItem };
