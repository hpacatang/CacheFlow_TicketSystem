import React, { useState } from "react";
import "./AccessCntrl.css";
import Layout from '../../Layout';

type Role = "user" | "agent" | "admin";

interface Permission {
  label: string;
  user: boolean;
  agent: boolean;
  admin: boolean;
}

const initialPermissions: Permission[] = [
  { label: "Create Ticket", user: true, agent: true, admin: true },
  { label: "Delete Ticket", user: true, agent: true, admin: true },
  { label: "Update Ticket", user: true, agent: true, admin: true },
];

const initialVisibility: Permission[] = [
  { label: "Manage Users", user: false, agent: false, admin: true },
  { label: "Analytics", user: false, agent: false, admin: true },
  { label: "Knowledge base", user: true, agent: true, admin: true },
];

export const AccessCntrl: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>(initialPermissions);
  const [visibility, setVisibility] = useState<Permission[]>(initialVisibility);

  const handleCheckboxChange = (
    type: "permissions" | "visibility",
    index: number,
    role: Role
  ) => {
    const state = type === "permissions" ? permissions : visibility;
    const setState = type === "permissions" ? setPermissions : setVisibility;
    const updated = [...state];
    updated[index] = { ...updated[index], [role]: !updated[index][role] };
    setState(updated);
  };

  return (
    <Layout module="access-control">
      <div style={{ flex: 1 }}>
        <div className="access-cntrl-container">
          <div className="access-cntrl-header">
            <h2>Permissions</h2>
          </div>
          <div className="access-cntrl-table">
            <table>
              <thead>
                <tr>
                  <th>Permissions</th>
                  <th>User</th>
                  <th>Agent</th>
                  <th>Admin</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, i) => (
                  <tr key={perm.label}>
                    <td>{perm.label}</td>
                    {(["user", "agent", "admin"] as Role[]).map((role) => (
                      <td key={role}>
                        <input
                          type="checkbox"
                          checked={perm[role]}
                          onChange={() => handleCheckboxChange("permissions", i, role)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="visibility-row">
                  <td colSpan={4} className="visibility-label">
                    Visibility
                  </td>
                </tr>
                {visibility.map((vis, i) => (
                  <tr key={vis.label}>
                    <td>{vis.label}</td>
                    {(["user", "agent", "admin"] as Role[]).map((role) => (
                      <td key={role}>
                        <input
                          type="checkbox"
                          checked={vis[role]}
                          onChange={() => handleCheckboxChange("visibility", i, role)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccessCntrl;