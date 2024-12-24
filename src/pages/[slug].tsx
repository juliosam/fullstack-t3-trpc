import Head from "next/head";
import { NextPage } from "next";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {

  const {data, isLoading} = api.profile.getUserByUserName.useQuery({
    username: "juliosam"
  });
  if(isLoading) return <div> Loading ... </div>
  if(!data) return <div> 404 No data</div>
  console.log(data)
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main style={{color:"black"}}>
        User Profile Page
      </main>
    </>
  );
};

export default ProfilePage;


