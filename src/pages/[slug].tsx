// ProfilePage.tsx
import Head from "next/head";
import { NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import styles from "./index.module.css";
import { PostView } from "~/components/postview";

const ProfileFeed = (props: {userId: string}) => {
  const {data, isLoading} = api.post.getPostsByUserId.useQuery({
    userId: props.userId
  });
  
  if (isLoading) return <div>Is Loading...</div>

  if (!data || data.length === 0) return <div>User has not posted</div>
  console.log(data)
  return (
    <div>
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id}/>
      ))}
    </div>
  )
};

interface ProfilePageProps {
  username: string;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ username }) => {
  console.log(username);
  const { data} = api.profile.getUserByUserName.useQuery({
    username,
  });
  if (!data) return <div>404 - User not found</div>;

  return (
    <>
      <Head>
        <title>{data.username} profile</title>
      </Head>
      <PageLayout>
        <div className={styles.profiletop}>
          <img
            src={data.profileImageUrl}
          />
        </div>
        <div className={styles.profileinfo}>
          <h1>@{data.username}</h1>
          <ProfileFeed userId={data.id}/>
        </div>
      </PageLayout>
    </>
  );
};

// ssgHelper.ts
import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";

// getStaticProps y getStaticPaths
import { GetStaticProps, GetStaticPaths } from "next";

export const getStaticProps: GetStaticProps = async (context) => {
  const ctx = {db, userId: null}
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx,
    transformer: superjson,
  });
  const slug = context.params?.slug as string | undefined;

  if (!slug) {
    return { notFound: true };
  }

  const username = slug.replace("@", "");
  await ssg.profile.getUserByUserName.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
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



export default ProfilePage;