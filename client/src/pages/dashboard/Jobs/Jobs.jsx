import React, { Suspense } from "react";
import Loading from "../../../components/Loading";

const RecruiterJobs = React.lazy(() => import("../../../components/RecruiterJobs"));

const ManageJobs = () => {
  return (
    <Suspense fallback={<Loading />}>
      <RecruiterJobs />
    </Suspense>
  );
};

export default ManageJobs;
