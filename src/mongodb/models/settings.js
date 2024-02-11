import { Schema, model, models } from 'mongoose';

const SettingsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: false,
  },
  autoskip: {
    type: Boolean,
    default: false,
  },
  autonext: {
    type: Boolean,
    default: false,
  },
  load: {
    type: String,
    enum: ['idle', 'visible', 'eager'],
    default: 'idle',
  },
  audio: {
    type: Boolean,
    default: false,
  },
  herotrailer: {
    type: Boolean,
    default: false,
  },
});

const Settings = models.Settings || model('Settings', SettingsSchema);

export default Settings;