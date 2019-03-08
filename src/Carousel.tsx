import React from "react";
import { PetMedia, PetPhoto } from "petfinder-client";

interface IProps {
  media: PetMedia;
}

interface IState {
  active: number;
  photos: PetPhoto[];
}

class Carousel extends React.Component<IProps, IState> {
  public state: IState = {
    photos: [],
    active: 0
  };
  public static getDerivedStateFromProps({ media }: IProps) {
    let photos: PetPhoto[] = [];
    if (media && media.photos && media.photos.photo) {
      photos = media.photos.photo.filter(photo => photo["@size"] === "pn");
    }

    return { photos };
  }
  public handleIndexClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.dataset.index) {
      this.setState({
        active: +event.target.dataset.index
      });
    }
  };
  public render() {
    const { photos, active } = this.state;
    return (
      <div className="carousel">
        <img src={photos[active].value} alt="animal" />
        <div className="carousel-smaller">
          {photos.map((photo, index) => (
            // eslint-disable-next-line
            <img
              key={photo.value}
              onClick={this.handleIndexClick}
              data-index={index}
              src={photo.value}
              className={index === active ? "active" : ""}
              alt="animal thumbnail"
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Carousel;
