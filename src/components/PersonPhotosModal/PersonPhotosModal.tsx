import { getImageUrl } from "@/api/tmdbConfig";
import type { Image } from "@/api/tmdbTypes";
import cn from "classnames";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState, type FC } from "react";
import { createPortal } from "react-dom";

type PersonPhotosModalProps = {
  isOpen: boolean;
  photos: Image[];
  initialIndex?: number;
  onClose: () => void;
};

const PersonPhotosModal: FC<PersonPhotosModalProps> = ({
  isOpen,
  photos,
  initialIndex = 0,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [mainRef, mainApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: false,
  });
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedIndex(initialIndex);
    mainApi?.scrollTo(initialIndex);
    thumbsApi?.scrollTo(initialIndex);
  }, [initialIndex, isOpen, mainApi, thumbsApi]);

  useEffect(() => {
    if (!mainApi) {
      return;
    }

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      setSelectedIndex(index);
      thumbsApi?.scrollTo(index);
    };

    mainApi.on("select", onSelect);
    onSelect();

    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbsApi]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const scrollToImage = useCallback(
    (index: number) => {
      mainApi?.scrollTo(index);
    },
    [mainApi],
  );

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="person-photos-modal__backdrop" onClick={onClose}>
      <div
        className="person-photos-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Person photos gallery"
      >
        <button
          type="button"
          className="person-photos-modal__close"
          aria-label="Close gallery"
          onClick={onClose}
        >
          <span className="material-symbols-sharp material-symbols">close</span>
        </button>

        <div className="person-photos-modal__main embla">
          <div className="embla__viewport" ref={mainRef}>
            <div className="embla__container person-photos-modal__main-container">
              {photos.map((photo) => (
                <div
                  className="embla__slide person-photos-modal__main-slide"
                  key={photo.file_path}
                >
                  <img
                    src={getImageUrl(photo.file_path, "w780")}
                    alt="Person photo"
                    className="person-photos-modal__main-image"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="person-photos-modal__thumbs embla">
          <div className="embla__viewport" ref={thumbsRef}>
            <div className="embla__container person-photos-modal__thumbs-container">
              {photos.map((photo, index) => (
                <div
                  className="person-photos-modal__thumb-slide"
                  key={photo.file_path}
                >
                  <button
                    type="button"
                    className={cn("person-photos-modal__thumb", {
                      isActive: index === selectedIndex,
                    })}
                    aria-label={`Show photo ${index + 1}`}
                    onClick={() => scrollToImage(index)}
                  >
                    <img
                      src={getImageUrl(photo.file_path, "w185")}
                      alt="Person photo thumbnail"
                      className="person-photos-modal__thumb-image"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PersonPhotosModal;
