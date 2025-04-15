import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react'
import { useEffect, useState } from 'react';
import { HiArrowRight, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'

export default function DashSidebar() {

  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {

    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);


  return (
   <Sidebar className='w-full md:w-56'>
      <SidebarItems>
        <SidebarItemGroup>
          <Link to={'/dashboard?tab=profile'}>
            <SidebarItem active={tab === 'profile'} icon={HiUser} label={'Име на корисник'} labelColor='dark' >
              Корисник
            </SidebarItem>
          </Link>
          <SidebarItem icon={HiArrowRight} className='cursor-pointer' >
            Одјави се
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
   </Sidebar>
  )
}
