import moment from "moment";
import { generateUniqueKey } from "./functions";

export function mapPhotosList(
  photosList:
    | Array<{
        author: string;
        date: number;
        image: string;
        photoDescription: string;
      }>
    | undefined
) {
  if (photosList) {
    const list = photosList.map(photoItem => ({
      ...photoItem,
      date: moment.unix(photoItem.date).format("YYYY-MM-DD HH:mm:ss"),
      key: generateUniqueKey()
    }));

    return list.concat(list).concat(list);
  }
}
