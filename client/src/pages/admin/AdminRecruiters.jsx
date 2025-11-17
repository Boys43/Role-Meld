import React, { Suspense } from "react";
import Loading from "../../components/Loading";

const AdminRecruitersComponent = React.lazy(() => import("../../components/AdminRecruiters"));

const AdminRecruiters = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AdminRecruitersComponent />
    </Suspense>
  );
};

export default AdminRecruiters;
