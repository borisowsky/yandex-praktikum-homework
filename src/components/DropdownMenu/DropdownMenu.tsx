import React, {
  useMemo,
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import classnames from 'classnames';

import './DropdownMenu.css';

import { DropdownPortal } from './DropdownPortal';
import { DropdownItems } from './DropdownItems';
import { DropdownItem } from './DropdownItem';
import { DropdownContext, DropdownContextProvider } from './DropdownContext';

import { generateId } from '../../utils';

const DEFAULT_DELAY = 200;

interface DropdownMenuComponents {
  Items: typeof DropdownItems;
  Item: typeof DropdownItem;
  Provider: typeof DropdownContextProvider;
}

interface DropdownMenuProps {
  className?: string;
  /**
   * Content
   *
   * @example
   * <DropdownMenu.Items>
   *   <DropdownMenu.Item>One</DropdownMenu.Item>
   *   <DropdownMenu.Item>Two</DropdownMenu.Item>
   *   <DropdownMenu.Item>Three</DropdownMenu.Item>
   * </DropdownMenu.Items>
   */
  content: React.ReactNode;
  /**
   * Delay before dropdown content dissapears
   *
   * @default 200ms
   */
  delay?: number;
}

let closeTimeout: NodeJS.Timeout | null = null;

const DropdownMenu: React.FC<DropdownMenuProps> & DropdownMenuComponents = ({
  className,
  content,
  delay = DEFAULT_DELAY,
  children,
}) => {
  const currentDropdownId = useMemo(generateId, []);
  const { dropdownId, isOpen, open, close } = useContext(DropdownContext);
  const triggerElementRef = useRef<HTMLElement | null>(null);
  const contentElementRef = useRef<HTMLElement | null>(null);
  const [navStyles, setNavStyles] = useState({});

  const [coordinates, setCoordinates] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const handleOpen = useCallback(() => {
    open(currentDropdownId);
  }, [open, currentDropdownId]);

  // Handle outside click
  useEffect(() => {
    window.addEventListener('click', close);

    return () => {
      window.removeEventListener('click', close);
    };
  }, [close]);

  useLayoutEffect(() => {
    if (triggerElementRef.current) {
      const {
        top,
        right,
        bottom,
        left,
      } = triggerElementRef.current.getBoundingClientRect();

      setCoordinates({
        top: top + window.scrollY,
        right,
        bottom,
        left: left + window.scrollX,
      });
    }
  }, [triggerElementRef, dropdownId]);

  useLayoutEffect(() => {
    if (contentElementRef.current) {
      // Detect if height or width less than parent element size
      const isEnoughSpaceToRender = () => {
        if (triggerElementRef.current) {
          const { clientHeight, clientWidth } = contentElementRef.current!;

          const {
            clientHeight: triggerContainerHeight,
            clientWidth: triggerContainerWidth,
          } = triggerElementRef.current.parentElement!;

          const isEnoughHeight =
            coordinates.top + clientHeight < triggerContainerHeight;

          const isEnoughWidth =
            coordinates.left + clientWidth < triggerContainerWidth;

          return { isEnoughHeight, isEnoughWidth };
        }

        return { isEnoughHeight: true, isEnoughWidth: true };
      };

      const getContentStyles = () => {
        let xOffset = coordinates.left;
        let yOffset = coordinates.bottom;

        if (contentElementRef.current) {
          const { isEnoughHeight, isEnoughWidth } = isEnoughSpaceToRender();

          if (!isEnoughHeight) {
            yOffset = coordinates.top - contentElementRef.current.clientHeight;
          }

          if (!isEnoughWidth) {
            xOffset = coordinates.right - contentElementRef.current.clientWidth;
          }
        }

        return {
          transform: `translate3d(${xOffset}px, ${yOffset}px, 0)`,
        };
      };

      setNavStyles(getContentStyles());
    }
  }, [coordinates, isOpen]);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    isOpen ? close() : handleOpen();
  };

  // Prevent content from closing after clicking on none-interactive items
  const handleNavClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  const handleMouseEnter: React.MouseEventHandler<HTMLDivElement> = () => {
    handleOpen();
    clearTimeout(closeTimeout!);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLDivElement> = () => {
    closeTimeout = setTimeout(close, delay);
  };

  const shouldShowOnlyCurrentNode = currentDropdownId === dropdownId;
  const shouldDisplayDropdown = isOpen && shouldShowOnlyCurrentNode;

  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement(children, {
          ref: triggerElementRef,
          onClick: handleClick,
          onMouseEnter: handleMouseEnter,
          onMouseLeave: handleMouseLeave,
          className: classnames(className, 'dropdown-trigger', {
            'dropdown-trigger--is-active': shouldDisplayDropdown,
          }),
        })}

      {shouldDisplayDropdown && (
        <DropdownPortal>
          <nav
            className="dropdown"
            ref={contentElementRef}
            onClick={handleNavClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={navStyles}
          >
            {content}
          </nav>
        </DropdownPortal>
      )}
    </>
  );
};

DropdownMenu.Items = DropdownItems;
DropdownMenu.Item = DropdownItem;
DropdownMenu.Provider = DropdownContextProvider;

export { DropdownMenu };
