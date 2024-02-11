import { Schema, model, models } from 'mongoose';

const WatchSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  aniId: {
    type: String,
    default: null,
  },
  aniTitle: {
    type: String,
    default: null,
  },
  epTitle: {
    type: String,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  epId: {
    type: String,
    required: true,
  },
  epNum: {
    type: Number,
    default: null,
  },
  timeWatched: {
    type: Number,
    default: null,
  },
  duration: {
    type: Number,
    default: null,
  },
  provider: {
    type: String,
    default: null,
  },
  nextepId: {
    type: String,
    default: null,
  },
  nextepNum: {
    type: Number,
    default: null,
  },
  subtype: {
    type: String,
    default: "sub",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Watch = models.Watch || model('Watch', WatchSchema);

export default Watch;