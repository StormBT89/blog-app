import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput} from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaMoon, FaSun } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { toogleTheme } from '../redux/theme/themeSlice.js'

export default function Header() {
    const path = useLocation().pathname;   
    const dispatch = useDispatch(); 
    const { currentUser } = useSelector((state) => state.user);
    const { lux } = useSelector((state) => state.theme);
    
  return (
   <Navbar className='border-b-2'>
      <Link to={'/'} className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
            rounded-lg text-white'>Brain</span>
            Storming 
      </Link>
      <form>
        <TextInput
            type='text'
            placeholder='Пронајди ..'
            rightIcon={AiOutlineSearch}
            className='hidden lg:inline'
        />
      </form> 
      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch/>
      </Button>      
      <div className='flex gap-2 md:order-2'>
        <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={() => dispatch(toogleTheme())}>
            {lux === 'light' ? <FaMoon/>  : <FaSun/>}          
        </Button> 
        {
            currentUser ? (                
                <Dropdown   arrowIcon={false}
                            inline
                            label={
                               <Avatar alt='user'
                                       img={currentUser.profilePicture}
                                       rounded />
                            }>
                   <DropdownHeader>
                    <span className='block text-sm font-medium'>Корисничко име: {currentUser.username}</span>
                    <span className='block text-sm font-medium' truncate> е-маил: {currentUser.email}</span>
                   </DropdownHeader>
                   <Link to={'/dashboard?tab=profile'}>
                        <DropdownItem>
                            Профил
                        </DropdownItem>
                   </Link>
                   <DropdownDivider />
                   <DropdownItem>
                    Одјави се
                    </DropdownItem>
                </Dropdown>
            ) : (
                <Link to='/sign-in'>
                <Button outline>
                    Најави се
                </Button>
            </Link>   
            )
        }       
      
        <NavbarToggle/>   
      </div>
      <NavbarCollapse>
            <NavbarLink active={path === '/'} as={'div'}>
            <Link to={'/'}>
                Почетна
            </Link>                
            </NavbarLink>
            <NavbarLink active={path === '/about'} as={'div'}>
                <Link to={'/about'}>
                    Контакт
                </Link>                
            </NavbarLink>
            <NavbarLink active={path === '/projects'} as={'div'}>
                <Link to={'/projects'}>
                    Проекти
                </Link>                
            </NavbarLink>
        </NavbarCollapse>  
   </Navbar>
  )
}
