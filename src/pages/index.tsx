import Head from "next/head";
import Link from "next/link";

import { api, RouterOutputs } from "~/utils/api";
import styles from "./index.module.css";
import { SignedIn, SignedOut, useUser } from '@clerk/nextjs';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { NextPage } from "next";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const user = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext()
  const { mutate, isPending: isPosting } = api.post.create.useMutation({ 
    onSuccess: () => {
      setInput("");
      void  ctx.post.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content?.[0];
      toast.error(errorMessage ?? "Failed to post, please try again later");
    }
  });

  if (!user) return null
  console.log(user.user);
  return (
    <div className={styles.post}>
      <img src={user.user?.imageUrl} alt="Profile Img" className={styles.postImg}/>
      <input 
        placeholder='add comment...' 
        style={{
          width:'90%', 
          background:'none', 
          border:'none',
          // border:'1px gray solid',
          borderRadius:'0.3em', 
          minHeight:'3.5em', 
          color:'white',
          padding:'0.5em 1em'
        }}
        type="text"
        value={input}
        onChange={(e)=> setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if(e.key === "Enter"){
            e.preventDefault();
            if(input !== ""){
              mutate({content: input})
            }
          }
        }}
      />
      {input !== "" && !isPosting && (<button onClick={()=> mutate({content: input})} disabled={isPosting} className={styles.postButton}>
        Post
      </button>)}
      {isPosting && <div>Loading...</div>}
    </div>
  )
}

type PostWithRouter = RouterOutputs["post"]["getAll"][number];

const PostView = (props: PostWithRouter) => {
  const {post, author} = props;
  
  return (
    <div key={post.id} className={styles.tuit}>
      {/* <div className={styles.tuitpic}>user-pic</div> */}
      <img src={author?.profileImageUrl} className={styles.tuitpic}/>
      <div style={{display:'flex', flexDirection:'column'}}>
        <div style={{color:'darkgray'}}>
          <Link href={`/@${author.username}`}><span>{`@${author.username}`}</span> .</Link>
          <Link href={`/post/${post.id}`}>
          <span style={{fontWeight:'lighter'}}> {dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Home: NextPage = () => {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Something went wrong</div>

  console.log(data);

  return (
    <>
      <Head>
        <title>Twotter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <Toaster position="bottom-center"/>
        <SignedIn>
          <CreatePostWizard/>
        </SignedIn>
        <div className={styles.list}>
          {data?.map((fullPost) => (
            <PostView {...fullPost} key={fullPost.post.id}/>
            )
          )}
        </div>
      </PageLayout>
    </>
  );
};

export default Home;


