import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css";
import { fetchPosts } from "../../services/postService";
import { useDebouncedCallback } from "use-debounce";
import { Post } from "../../types/post";
import PostForm from "../CreatePostForm/CreatePostForm";
import EditPostForm from "../EditPostForm/EditPostForm";
import Modal from "../Modal/Modal";

const LIMIT = 20;

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatePost, setIsCreatePost] = useState(false);
  const [isEditPost, setIsEditPost] = useState(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["posts", searchQuery, currentPage],
    queryFn: () => fetchPosts(searchQuery, currentPage, LIMIT),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEdit = (post: Post) => {
    setEditedPost(post);
    setIsEditPost(true);
    setIsCreatePost(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditedPost(null);
    setIsEditPost(false);
    setIsCreatePost(false);
    setIsModalOpen(false);
  };

  const handleChange = useDebouncedCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event?.target.value);
  }, 1000);

  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / LIMIT) : 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleChange} />

        <button
          className={css.button}
          onClick={() => {
            setIsCreatePost(true);
            setIsEditPost(false);
            setIsModalOpen(true);
          }}
        >
          Create post
        </button>
      </header>

      {isModalOpen && (
        <Modal>
          {isEditPost && editedPost && (
            <EditPostForm initialValues={editedPost} onClose={handleCloseModal} />
          )}
          {isCreatePost && !isEditPost && <PostForm onClose={handleCloseModal} />}
        </Modal>
      )}

      {data && data?.posts.length > 0 && <PostList posts={data.posts} handleEdit={handleEdit} />}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
