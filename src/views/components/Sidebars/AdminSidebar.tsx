import React from 'react'
import { AdminLinks} from './Links/AdminLink';
import SidebarLayout from './SidebarLayout';

export const AdminSidebar = () => {
  return (
    <div>
        <SidebarLayout>
            <AdminLinks/>
        </SidebarLayout>
    </div>
  )
}
