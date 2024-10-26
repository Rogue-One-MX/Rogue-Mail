'use client';

import { useAuthContext } from "@/context/AuthContext";
import { Emailformat } from "@/components/Emailformat/index"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


function Page(): JSX.Element {
  // Access the user object from the authentication context
  const { user } = useAuthContext() as { user: any }; // Use 'as' to assert the type as { user: any }
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page if the user is not logged in
    if (user == null) {
      router.push("/");
    }
  }, [user, router]); // Include 'router' in the dependency array to resolve eslint warning

  return (
    <div>
      {user ? (
        // Render Emailformat component if user is logged in
        <Emailformat />
      ) : (
        <h1>Only logged-in users can view this page</h1>
      )}
    </div>
  );
}

export default Page;
