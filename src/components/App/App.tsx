import Section from "../Section/Section";
import Container from "../Container/Container";
import Form from "../Form/Form";
import { getPhotos } from "../../services/photos";
import { useState } from "react";
import type { Photo } from "../../types/photo";
import PhotosGallery from "../PhotosGallery/PhotosGallery";
import toast from "react-hot-toast";
import Text from "../Text/Text";
import Loader from "../Loader/Loader";
import Modal from "../Modal/Modal";

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const onSubmit = async (query: string) => {
    setIsEmpty(false);
    setIsLoading(true);
    setSelectedPhoto(null);

    try {
      const data = await getPhotos(query);
      if (!data.length) {
        toast.error(`We don't find photos with ${query}`);
        setIsEmpty(true);
        return;
      }
      setPhotos(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={onSubmit} />
          {photos.length > 0 && (
            <PhotosGallery photos={photos} onPhotoClick={openModal} />
          )}
          {isEmpty && <Text textAlign="center">{"We don't find photos"}</Text>}
          {isLoading && <Loader />}
        </Container>
      </Section>

      {selectedPhoto && (
        <Modal onClose={closeModal}>
          <img
            src={selectedPhoto.src.original}
            alt={selectedPhoto.alt}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Modal>
      )}
    </>
  );
}
