import React, { Suspense } from "react";
import Loading from "../../components/Loading";

const AdminPackagesComponent = React.lazy(() => import("../../components/AdminPackages"));

const AdminPackages = () => {
    return (
        <Suspense fallback={<Loading />}>
            <AdminPackagesComponent />
        </Suspense>
    );
};

export default AdminPackages;
