import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose"
import { Event } from "./event.model"

export interface BookingDocument {
  eventId: Types.ObjectId
  email: string
  createdAt: Date
  updatedAt: Date
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: "Invalid email format.",
      },
    },
  },
  {
    timestamps: true,
  },
)

bookingSchema.index({ eventId: 1, email: 1 }, { unique: true })

bookingSchema.pre("save", async function (this: HydratedDocument<BookingDocument>) {
  this.email = this.email.trim().toLowerCase()
  if (!EMAIL_REGEX.test(this.email)) {
    throw new Error("Invalid email format.")
  }

  // Ensure bookings only reference existing events.
  if (this.isModified("eventId") || this.isNew) {
    const exists = await Event.exists({ _id: this.eventId })
    if (!exists) {
      throw new Error("Referenced event does not exist.")
    }
  }
})

type BookingModel = Model<BookingDocument>

export const Booking =
  (models.Booking as BookingModel | undefined) ??
  model<BookingDocument>("Booking", bookingSchema)
