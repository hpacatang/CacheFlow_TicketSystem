import React from 'react'
import { UserLinks} from './Links/UserLink';
import SidebarLayout from './SidebarLayout';

export const UserSidebar = () => {
  return (
        <SidebarLayout>
            <UserLinks/>
        </SidebarLayout>
  )
}

export default UserSidebar;