import { Post } from "../../types/post";
import css from "./PostList.module.css";

interface PostListProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
}

export default function PostList({ posts, handleEdit }: PostListProps) {
  return (
    <ul className={css.list}>
      {posts.map((post) => (
        <li key={post.id} className={css.listItem}>
          <h2 className={css.title}>{post.title}</h2>
          <p className={css.content}>{post.body}</p>
          <div className={css.footer}>
            <button onClick={() => handleEdit(post)} className={css.edit}>
              Edit
            </button>
            <button className={css.delete}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
