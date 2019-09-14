import { Observable, Observer } from "rxjs";
import { ICanvasImageSize, IBase64ImageWithSize } from "../../interfaces";

export default class Webcam {
  public webcamElement: HTMLVideoElement;
  private canvasElement: HTMLCanvasElement;

  constructor(webcamElement: HTMLVideoElement) {
    this.webcamElement = webcamElement;
    this.canvasElement = document.createElement("canvas");
  }

  public setup(): Observable<Function> {
    return Observable.create(
      (observer: Observer<{ width: number; heigth: number }>) => {
        if (navigator.mediaDevices.getUserMedia !== undefined) {
          navigator.mediaDevices
            .getUserMedia({
              audio: false,
              video: { facingMode: "user" }
            })
            .then((mediaStream: MediaStream) => {
              this.webcamElement.srcObject = mediaStream;
              this.webcamElement.addEventListener("loadeddata", () => {
                this._adjustVideoSize(
                  this.webcamElement.videoWidth,
                  this.webcamElement.videoHeight
                );
                observer.next({
                  width: this.webcamElement.videoWidth,
                  heigth: this.webcamElement.videoHeight
                });
                observer.complete();
              });
            });
        } else {
          observer.error("No access to camera device");
        }
      }
    );
  }

  public takeBlobPhoto(): Observable<Function> {
    const { imageWidth, imageHeight }: ICanvasImageSize = this._drawImage();

    return Observable.create((observer: any) => {
      if (this.canvasElement instanceof HTMLCanvasElement) {
        this.canvasElement.toBlob(blob => {
          observer.next({ blob, imageHeight, imageWidth });
        });
      }
    });
  }

  public takeBase64Photo(
    { type, quality }: { type: string; quality: number } = {
      type: "jpg",
      quality: 0.6
    }
  ): IBase64ImageWithSize {
    const { imageHeight, imageWidth }: ICanvasImageSize = this._drawImage();
    const base64: string = this.canvasElement.toDataURL(
      "image/" + type,
      quality
    );

    return { base64, imageHeight, imageWidth };
  }

  private _adjustVideoSize(width: number, height: number): void {
    const aspectRatio: number = width / height;
    if (width >= height) {
      this.webcamElement.width = aspectRatio * this.webcamElement.height;
    } else {
      this.webcamElement.height = this.webcamElement.width / aspectRatio;
    }
  }

  private _drawImage(): ICanvasImageSize {
    const imageWidth: number = this.webcamElement.videoWidth;
    const imageHeight: number = this.webcamElement.videoHeight;
    const context: CanvasRenderingContext2D | null = this.canvasElement.getContext(
      "2d"
    );

    this.canvasElement.width = imageWidth;
    this.canvasElement.height = imageHeight;

    if (context instanceof CanvasRenderingContext2D) {
      context.drawImage(this.webcamElement, 0, 0, imageWidth, imageHeight);
    }

    return {
      imageHeight,
      imageWidth
    };
  }
}
