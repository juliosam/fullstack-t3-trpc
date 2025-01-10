// ProfilePage.tsx
import Head from "next/head";
import { NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { getSSGHelper } from "~/server/helpers/ssgHelper";
// getStaticProps y getStaticPaths
import { GetStaticProps, GetStaticPaths } from "next";
import { PostView } from "~/components/postview";


interface SinglePostPageProps {
  id: string;
}

const SinglePostPage: NextPage<SinglePostPageProps> = ({ id }) => {
  console.log(id);
  const { data} = api.post.getById.useQuery({
    id,
  });
  if (!data) return <div>404 - User not found</div>;

  return (
    <>
      <Head>
        <title>{data.post.content.substring(0,25)}</title>
      </Head>
      <PageLayout>
        <PostView {...data}/>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = getSSGHelper()
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no Id")

  await ssg.post.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 5, // ISR
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking", // Corrige el typo
  };
};

export default SinglePostPage;


