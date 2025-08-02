import type { Photo } from "../../types/photo";
import styles from "./PhotosGalleryItem.module.css";

interface PhotosGalleryItemProps {
  photo: Photo;
  onClick?: () => void;
}

export default function PhotosGalleryItem({
  photo,
  onClick,
}: PhotosGalleryItemProps) {
  return (
    <div
      className={styles.thumb}
      onClick={onClick}
      style={{
        backgroundColor: photo.avg_color,
        borderColor: photo.avg_color,
        cursor: "pointer",
      }}
    >
      <img src={photo.src.original} alt={photo.alt} />
    </div>
  );
}
