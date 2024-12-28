import Link from "next/link";

import { RouterOutputs } from "~/utils/api";
import styles from "../pages/index.module.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithRouter = RouterOutputs["post"]["getAll"][number];

export const PostView = (props: PostWithRouter) => {
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