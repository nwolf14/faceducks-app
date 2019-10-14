import { IPhoto } from "../interfaces";
export {};

const Photo = require("../models/Photo");
const validatePostPhotoPayload = require("../validation/post-photo");


const create = function(req: any, res: any) {
  const { isValid, errors } = validatePostPhotoPayload(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const { author, authorId, created_at, description, photo, hashtagsList } = req.body;
  const newPhoto = new Photo({ author, authorId, created_at, description, hashtagsList, photo });
  newPhoto
    .save()
    .then(() => {
      res.status(200).json({ success: true });
    })
    .catch((err: any) => {
      res.status(400).json({ error: err.message});
    });
};

module.exports.create = create;

const get = function(req: any, res: any) {
  const { authorId, skip = 0, limit = 10 } = req.query
  const filter: { authorId?: string; } = {};
  const sort: {created_at: number; } = { created_at: -1 };

  if (authorId) {
    filter.authorId = authorId;
  }

  Photo.find(filter, null, { skip: Number(skip), limit: Number(limit), sort })
    .then((photos: Array<IPhoto>) => res.json({ result: photos }))
    .catch((err: any) => res.status(500).json({ error: err.message }));
};

module.exports.get = get;
