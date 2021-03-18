import './App.css';
import { DropdownMenu } from './components';

const App = () => {
  const dropdownContent = (
    <DropdownMenu.Items>
      <DropdownMenu.Item>Pretty long long long long item #1</DropdownMenu.Item>

      <DropdownMenu.Item>
        <a href="/#">Link works too</a>
      </DropdownMenu.Item>

      <DropdownMenu.Item>
        <div onClick={() => alert('Callback')}>Click me</div>
      </DropdownMenu.Item>
    </DropdownMenu.Items>
  );

  return (
    <DropdownMenu.Provider>
      <main className="main">
        <DropdownMenu
          className="main__trigger main__trigger--top-left"
          content={dropdownContent}
        >
          <button>Top left</button>
        </DropdownMenu>

        <DropdownMenu
          className="main__trigger main__trigger--top-right"
          content={dropdownContent}
        >
          <button>Top right</button>
        </DropdownMenu>

        <DropdownMenu
          className="main__trigger main__trigger--bottom-right"
          content={dropdownContent}
        >
          <button>Bottom right</button>
        </DropdownMenu>

        <DropdownMenu
          className="main__trigger main__trigger--bottom-left"
          content={dropdownContent}
        >
          <button>Bottom left</button>
        </DropdownMenu>
      </main>
    </DropdownMenu.Provider>
  );
};

export { App };
