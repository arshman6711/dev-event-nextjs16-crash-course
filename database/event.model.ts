import {
  HydratedDocument,
  Model,
  Schema,
  model,
  models,
} from "mongoose"

export interface EventDocument {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const REQUIRED_STRING_FIELDS: Array<keyof Pick<
  EventDocument,
  | "title"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer"
>> = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function normalizeDateToIso(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Invalid date. Use a valid date format.")
  }
  // Store date in ISO format for consistent sorting and serialization.
  return parsed.toISOString()
}

function normalizeTime(value: string): string {
  const input = value.trim().toLowerCase()
  const match = input.match(/^(\d{1,2}):(\d{2})(?:\s*([ap]m))?$/)

  if (!match) {
    throw new Error("Invalid time. Use HH:mm or h:mm am/pm format.")
  }

  let hours = Number(match[1])
  const minutes = Number(match[2])
  const suffix = match[3]

  if (minutes < 0 || minutes > 59) {
    throw new Error("Invalid time minutes.")
  }

  if (suffix) {
    if (hours < 1 || hours > 12) {
      throw new Error("Invalid 12-hour time value.")
    }
    if (suffix === "pm" && hours !== 12) {
      hours += 12
    }
    if (suffix === "am" && hours === 12) {
      hours = 0
    }
  } else if (hours < 0 || hours > 23) {
    throw new Error("Invalid 24-hour time value.")
  }

  // Normalize to 24-hour HH:mm representation.
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

const eventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: "Agenda must contain at least one item.",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: "Tags must contain at least one item.",
      },
    },
  },
  {
    timestamps: true,
  },
)

eventSchema.index({ slug: 1 }, { unique: true })

eventSchema.pre("save", function (this: HydratedDocument<EventDocument>) {
  // Guard against empty required fields beyond basic required checks.
  for (const field of REQUIRED_STRING_FIELDS) {
    const raw = this[field]
    if (typeof raw !== "string" || raw.trim().length === 0) {
      throw new Error(`${field} is required and cannot be empty.`)
    }
    this[field] = raw.trim() as EventDocument[typeof field]
  }

  const normalizedAgenda = this.agenda.map((item) => item.trim()).filter(Boolean)
  if (normalizedAgenda.length === 0) {
    throw new Error("Agenda must contain at least one non-empty item.")
  }
  this.agenda = normalizedAgenda

  const normalizedTags = this.tags.map((item) => item.trim()).filter(Boolean)
  if (normalizedTags.length === 0) {
    throw new Error("Tags must contain at least one non-empty item.")
  }
  this.tags = normalizedTags

  if (this.isModified("title")) {
    // Regenerate slug only when title changes.
    this.slug = slugify(this.title)
  } else if (!this.slug) {
    this.slug = slugify(this.title)
  }

  this.date = normalizeDateToIso(this.date)
  this.time = normalizeTime(this.time)
})

type EventModel = Model<EventDocument>

export const Event =
  (models.Event as EventModel | undefined) ??
  model<EventDocument>("Event", eventSchema)
