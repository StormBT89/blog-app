import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { lux } = useSelector((state) => state.theme);
  const boja = lux === 'light' ? 'bg-white-200' : 'bg-gray-900';
  return (
    <div className={boja}>
        <div className='bg-light text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        {children}
        </div>        
    </div>
  );
}