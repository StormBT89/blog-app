import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowRight, HiDocumentText, HiOutlineUserGroup, HiUser, HiAnnotation, HiChartPie } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice.js'


export default function DashSidebar() {

  const location = useLocation();
  const [tab, setTab] = useState();
  const dispatch = useDispatch();
  const {currentUser} = useSelector((state) => state.user);

  useEffect(() => {

    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
      try {
        const res = await fetch('/api/user/signout', {
          method: 'POST',
        });      
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else {
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);        
      }
    }

  return (
   <Sidebar className='w-full md:w-56'>
      <SidebarItems>
        <SidebarItemGroup className='flex flex-col'>
          {
            currentUser && currentUser.isAdmin && (
              <Link to={'/dashboard?tab=dash'}>
                <SidebarItem  active={tab === 'dssh' || !tab} 
                             icon={HiChartPie} 
                             as='div'>
                   Работна маса
                </SidebarItem>
              </Link>
            )
          }        
          <Link to={'/dashboard?tab=profile'}>
            <SidebarItem  active={tab === 'profile'} icon={HiUser} 
                          label={currentUser.isAdmin ? 'Админ' : 'Корисник'} labelColor='dark' as='div'>
              Профил
            </SidebarItem>
          </Link>
          {
            currentUser.isAdmin && (
              <Link to='/dashboard?tab=posts'>
              <SidebarItem active={tab === 'posts'} icon={HiDocumentText} as='div'>
                Состаноци
              </SidebarItem>
            </Link>
            )
          } 
           {
            currentUser.isAdmin && (
              <>              
              <Link to='/dashboard?tab=users'>
                <SidebarItem active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                Корисници
                </SidebarItem>
              </Link>
              <Link to='/dashboard?tab=comments'>
                  <SidebarItem active={tab === 'comments'} icon={HiAnnotation} as='div'>
                   Мислење
                  </SidebarItem>
              </Link>
              </>             
            )
          }           
          <SidebarItem onClick={handleSignout} icon={HiArrowRight} className='cursor-pointer'>
            Одјави се
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
   </Sidebar>
  )
}
