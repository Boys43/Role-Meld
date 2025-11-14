import React, { Suspense } from "react";
import Loading from "../../components/Loading";

const AdminUsers = React.lazy(() => import("../../components/AdminUsers"));

const Candidates = () => {
  return (
    <Suspense fallback={<Loading />}>
      <AdminUsers />
    </Suspense>
  );
};

export default Candidates;
