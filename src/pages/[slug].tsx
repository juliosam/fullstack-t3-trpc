// ProfilePage.tsx
import Head from "next/head";
import type { NextPage } from "next";
// import Image from "next/image";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import styles from "./index.module.css";
import { PostView } from "~/components/postview";
import { getSSGHelper } from "~/server/helpers/ssgHelper";
// getStaticProps y getStaticPaths
import type { GetStaticProps, GetStaticPaths } from "next";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.post.getPostsByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return <div>Is Loading...</div>;

  if (!data || data.length === 0) return <div>User has not posted</div>;
  console.log(data);
  return (
    <div>
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

interface ProfilePageProps {
  username: string;
}

const ProfilePage: NextPage<ProfilePageProps> = ({ username }) => {
  console.log(username);
  const { data } = api.profile.getUserByUserName.useQuery({
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
          <img alt="" src={data.profileImageUrl} />
        </div>
        <div className={styles.profileinfo}>
          <h1>@{data.username}</h1>
          <ProfileFeed userId={data.id} />
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = getSSGHelper();
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
