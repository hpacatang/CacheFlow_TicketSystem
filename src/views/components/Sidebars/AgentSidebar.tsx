import React from 'react'
import { AgentLinks} from './Links/AgentLink';
import SidebarLayout from './SidebarLayout';

export const AdminSidebar = () => {
  return (
    <div>
        <SidebarLayout>
            <AgentLinks/>
        </SidebarLayout>
    </div>
  )
}
