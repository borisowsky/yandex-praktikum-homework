import { useRef } from 'react';
import ReactDOM from 'react-dom';

const DropdownPortal: React.FC = ({ children }) => {
  const portalElementRef = useRef<HTMLElement | null>(
    document.querySelector('#dropdown-portal'),
  );

  if (!portalElementRef.current) {
    portalElementRef.current = document.createElement('div');
    portalElementRef.current.setAttribute('id', 'dropdown-portal');

    document.querySelector('body')!.appendChild(portalElementRef.current);
  }

  return ReactDOM.createPortal(children, portalElementRef.current);
};

export { DropdownPortal };
