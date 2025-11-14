import React, { Suspense } from "react";
import Loading from "../../components/Loading";

const SavedJobs = React.lazy(() => import("../../components/SavedJobs"));

const Package = () => {
  return (
    <Suspense fallback={<Loading />}>
      <SavedJobs />
    </Suspense>
  );
};

export default Package;
