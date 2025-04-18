import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signoutSuccess } from '../redux/user/userSlice.js'

export default function DashSidebar() {

  const location = useLocation();
  const [tab, setTab] = useState();
  const dispatch = useDispatch();

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
        <SidebarItemGroup>
          <Link to={'/dashboard?tab=profile'}>
            <SidebarItem active={tab === 'profile'} icon={HiUser} label={'Име на корисник'} labelColor='dark' as='button' >
              Корисник
            </SidebarItem>
          </Link>
          <SidebarItem onClick={handleSignout} icon={HiArrowRight} className='cursor-pointer'>
            Одјави се
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
   </Sidebar>
  )
}
