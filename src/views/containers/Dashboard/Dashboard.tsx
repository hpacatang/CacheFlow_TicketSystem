import axios from "axios";
import { useEffect } from "react";
import Layout from '../../Layout';

export const Dashboard = () => {
  // Backend API endpoint
  const getEmployees = async () => {
    return axios.get("/api/statistics");
  };

  useEffect(() => {
    getEmployees()
      .then((response) => {
        console.log(response.data);
      })
      .catch((data) => {
        console.log(data);
      })
      .finally(() => {});
  }, []);

  return (
    <Layout module="dashboard">
      <div>
        <h1>Dashboard Screen</h1>
      </div>
    </Layout>
  );
};
