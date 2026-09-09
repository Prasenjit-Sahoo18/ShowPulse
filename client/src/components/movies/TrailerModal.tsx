import React from 'react';
import { Modal } from '../common/Modal.js';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl?: string | null;
  movieTitle: string;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({
  isOpen,
  onClose,
  trailerUrl,
  movieTitle,
}) => {
  if (!trailerUrl) return null;

  // Extract YouTube ID if possible
  const getEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  const embedUrl = getEmbedUrl(trailerUrl);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${movieTitle} - Official Trailer`} maxWidth="2xl">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
        <iframe
          src={embedUrl}
          title={`${movieTitle} Trailer`}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </Modal>
  );
};
