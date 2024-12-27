import Head from "next/head";
import { NextPage } from "next";
import { PageLayout } from "~/components/layout";

const SinglePostPage: NextPage = () => {

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        Single Post Page
      </PageLayout>
    </>
  );
};

export default SinglePostPage;


